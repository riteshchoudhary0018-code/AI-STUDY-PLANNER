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
const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-flash-latest";
const systemInstruction = `You are an educational AI assistant inside an AI Study Planner application.
Answer the student's questions clearly and accurately. You can help with any educational topic,
programming, mathematics, science, general knowledge, study planning, revision, explanations,
examples, quizzes and code. Do not restrict yourself to the student's currently selected subjects.
Use the student's study context when it is relevant, especially for study-planning questions.
Explain difficult concepts in simple language when appropriate. Give step-by-step explanations for
problems when useful. Do not invent information when uncertain.`;

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

        const request = {
            model,
            contents: `Student study context (use only when relevant):
${JSON.stringify(studyContext)}

Student question:
${message.trim()}`,
            config: {
                systemInstruction
            }
        };

        let response;
        let activeModel = model;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                response = await ai.models.generateContent({
                    ...request,
                    model: activeModel
                });
                break;
            } catch (error) {
                const isQuotaFailure = Number(error?.status) === 429
                    || /quota|rate limit|resource exhausted/i.test(String(error?.message || ""));
                const isModelFailure = Number(error?.status) === 400
                    || Number(error?.status) === 404
                    || /model|not found|unsupported/i.test(String(error?.message || ""));
                if (isQuotaFailure && activeModel !== fallbackModel && attempt === 0) {
                    activeModel = fallbackModel;
                    continue;
                }
                if (isModelFailure && activeModel !== fallbackModel) {
                    activeModel = fallbackModel;
                    continue;
                }
                const isTemporaryFailure = error && error.status === 503;
                if (!isTemporaryFailure || attempt === 2) {
                    throw error;
                }
                await sleep(600 * (attempt + 1));
            }
        }

        res.json({
            reply: response.text || "I couldn't generate an answer for that question."
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
        const safeMessage = upstreamStatus === 429 || /quota|rate limit|resource exhausted/i.test(message)
            ? "Gemini quota exceeded for this API project. Wait for the quota to reset, enable billing, or replace the exposed API key in .env with a new key."
            : /api key|api_key|authentication|credential|access.?token|permission|unauthorized|forbidden|unauthenticated/i.test(message)
            ? "Gemini authentication failed. Set GEMINI_API_KEY to a valid Google AI Studio API key in .env."
            : /not found|model|unsupported/i.test(message)
            ? "The configured Gemini model is unavailable. Use gemini-3.6-flash or gemini-flash-latest in .env."
            : "The Gemini service is temporarily unavailable. Check the server logs for details.";

        res.status(status).json({
            error: safeMessage
        });
    }
});

app.listen(port, () => {
    console.log(`Study Planner running at http://localhost:${port}`);
});