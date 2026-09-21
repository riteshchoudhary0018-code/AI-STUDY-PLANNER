import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const apiKey = process.env.GEMINI_API_KEY?.trim();
const hasUsableApiKey = Boolean(apiKey)
    && !/^replace_with_google_ai_studio_api_key$/i.test(apiKey);
const ai = hasUsableApiKey ? new GoogleGenAI({ apiKey }) : null;
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash";
const systemInstruction = `You are an educational AI assistant inside an AI Study Planner application.
Answer the student's questions clearly and accurately. You can help with any educational topic,
programming, mathematics, science, general knowledge, study planning, revision, explanations,
examples, quizzes and code. Do not restrict yourself to the student's currently selected subjects.
Use the student's study context when it is relevant, especially for study-planning questions.
Explain difficult concepts in simple language when appropriate. Give step-by-step explanations for
problems when useful. Be direct and concise by default so the student gets a fast answer.
Do not invent information when uncertain.`;

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

app.use(express.json());
app.use(express.static("."));

app.post("/api/chat", async (req, res) => {
    try {
        const { message, studyContext = {} } = req.body || {};
        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ error: "A non-empty message is required." });
        }
        if (!ai) {
            return res.status(503).json({
                error: "GEMINI_API_KEY is missing or is not a Google AI Studio API key. Create an API key in Google AI Studio and put it in .env."
            });
        }

        const fallbackChain = Array.from(
            new Set([
                model,
                fallbackModel,
                "gemini-2.5-flash-lite",
                "gemini-2.5-flash",
                "gemini-1.5-flash"
            ].filter(Boolean))
        );

        let response = null;
        let lastError = null;

        for (const candidateModel of fallbackChain) {
            try {
                const config = {
                    systemInstruction,
                    maxOutputTokens: 1024
                };
                if (/2\.5|thinking/i.test(candidateModel)) {
                    config.thinkingConfig = {
                        thinkingBudget: 0
                    };
                }

                response = await ai.models.generateContent({
                    model: candidateModel,
                    contents: `Student study context (use only when relevant):
${JSON.stringify(studyContext)}

Student question:
${message.trim()}`,
                    config
                });

                if (response?.text) {
                    break;
                }
            } catch (error) {
                lastError = error;
                const status = Number(error?.status);
                const msg = String(error?.message || "");
                console.warn(`[Gemini] Attempt with model "${candidateModel}" failed (status: ${status}): ${msg}`);

                // If authentication error, trying other models won't help
                const isAuthError = status === 401 || status === 403
                    || /api key|api_key|authentication|credential|unauthorized|forbidden|unauthenticated/i.test(msg);
                if (isAuthError) {
                    throw error;
                }

                // If temporary failure (503) or rate limit (429), wait slightly before trying the next model
                if (status === 503 || status === 429) {
                    await sleep(350);
                }
            }
        }

        if (!response?.text) {
            if (lastError) {
                throw lastError;
            }
            return res.status(500).json({ error: "Failed to generate a response from AI models." });
        }

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini API request failed:", error);

        const upstreamStatus = Number(error?.status);
        const status = upstreamStatus === 429
            ? 429
            : upstreamStatus >= 400 && upstreamStatus < 600
                ? 502
                : 500;
        const message = typeof error?.message === "string" ? error.message : "";

        let safeMessage = "The Gemini service is temporarily unavailable. Check the server logs for details.";

        if (upstreamStatus === 503 || /high demand|temporarily unavailable|spikes in demand|overloaded/i.test(message)) {
            safeMessage = "Google's Gemini service is currently experiencing high demand (503). Please try sending your question again in a few moments.";
        } else if (upstreamStatus === 429 || /quota|rate limit|resource exhausted/i.test(message)) {
            safeMessage = "Gemini quota exceeded for this API project. Wait for the quota to reset, enable billing, or replace the API key in .env with a new key.";
        } else if (/api key|api_key|authentication|credential|access.?token|permission|unauthorized|forbidden|unauthenticated/i.test(message)) {
            safeMessage = "Gemini authentication failed. Set GEMINI_API_KEY to a valid Google AI Studio API key in .env.";
        } else if (upstreamStatus === 404 || /models\/[^\s]+ is not found|not found for api version|unsupported model/i.test(message)) {
            safeMessage = "The configured Gemini model is unavailable. Please check GEMINI_MODEL in .env.";
        }

        res.status(status).json({
            error: safeMessage
        });
    }
});

app.listen(port, () => {
    console.log(`Study Planner running at http://localhost:${port}`);
});