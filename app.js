/**
 * OPTIMAL ACADEMIC STUDY ENGINE - INTERACTIVE APPLICATION
 * Built by Academic Coach AI
 */

// ==========================================
// 1. DATA STATE & INITIAL MODEL
// ==========================================
const DEFAULT_COURSES = [
  { id: 'ui-design', name: 'User Interface / Design', deadline: 'Design review and usability practice', confidence: 1, color: '#f43f5e' },
  { id: 'ai', name: 'Fundamentals of Artificial Intelligence', deadline: 'Core AI concepts and algorithms review', confidence: 2, color: '#f59e0b' },
  { id: 'rdbms', name: 'RDBMS', deadline: 'Database modeling and SQL practice', confidence: 2, color: '#6366f1' },
  { id: 'python', name: 'Python', deadline: 'Programming exercises and project practice', confidence: 3, color: '#10b981' },
  { id: 'networks', name: 'Computer Network', deadline: 'Networking concepts and protocol review', confidence: 3, color: '#06b6d4' }
];

const CURRENT_SUBJECTS = DEFAULT_COURSES.map(course => course.name);

const SUBJECT_MIGRATION = [
  { match: /calculus|math/i, subject: 'Python' },
  { match: /data structures|dsa|algorithm|cs 201/i, subject: 'Fundamentals of Artificial Intelligence' },
  { match: /computer systems|architecture|cs 220|cache/i, subject: 'Computer Network' },
  { match: /ethics|writing|eng 105|communication/i, subject: 'User Interface / Design' },
  { match: /spaced repetition|multi-course/i, subject: 'RDBMS' }
];

const DEFAULT_SCHEDULE = {
  mon: {
    heading: 'Monday — High-Friction Priority ("Eat the Frog")',
    availability: 'Study Window: 6:00 PM – 9:45 PM (3h 45m)',
    strategy: 'Attack your Level 1 (Calculus II) & Level 2 (DSA) topics first while cognitive reserves and neuroplasticity are peaked.',
    blocks: [
      { id: 'm1', blockTag: 'P1', blockClass: 'tag-p1', timeType: '6:00 PM – 6:30 PM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Lvl 1 - Urgent', badgeClass: 'conf-level-1', objective: 'Ratio & Root Test convergence proofs', recall: 'Closed-book Feynman breakdown on blank sheet', srSlot: 'D-7 Integral rules recall (15m)', done: false },
      { id: 'm2', blockTag: 'P2', blockClass: 'tag-p1', timeType: '6:35 PM – 7:05 PM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Lvl 1 - Urgent', badgeClass: 'conf-level-1', objective: 'Problem Set 4: Questions 1 to 4 under timed conditions', recall: 'Red-pen audit: identify condition mistakes vs algebra slips', srSlot: 'Quick formula blurt', done: false },
      { id: 'm3', blockTag: 'P3', blockClass: '', timeType: '7:15 PM – 7:45 PM (25m/5m)', subject: 'Data Structures & Algos (CS 201)', subjBadge: 'Lvl 2 - Weak Spot', badgeClass: 'conf-level-2', objective: 'Dynamic Programming: Memoization vs Tabulation structure', recall: 'Derive 0/1 Knapsack recursive state equation on paper', srSlot: 'D-3 Binary Heap flashcards', done: false },
      { id: 'm4', blockTag: 'P4', blockClass: '', timeType: '7:50 PM – 8:20 PM (25m/5m)', subject: 'Data Structures & Algos (CS 201)', subjBadge: 'Lvl 2 - Weak Spot', badgeClass: 'conf-level-2', objective: 'Assignment 3 Problem 1: Implement DP memoized solution', recall: 'Peer-teach explanation: vocalize step complexity aloud', srSlot: 'Review asymptotic notation', done: false },
      { id: 'm5', blockTag: 'SR', blockClass: 'tag-sr', timeType: '8:30 PM – 9:00 PM (30m Spaced Rep)', subject: 'Multi-Course Spaced Repetition', subjBadge: 'Retention Sweep', badgeClass: 'conf-level-3', objective: 'Run through Leitner Box 1 flashcards & review last week\'s errors', recall: 'Closed-book flashcard retrieval (aim for >85% accuracy)', srSlot: 'Consolidate cards to Box 2', done: false }
    ]
  },
  tue: {
    heading: 'Tuesday — Assignment Milestone & Targeted Execution',
    availability: 'Study Window: 6:30 PM – 9:30 PM (3h 00m)',
    strategy: 'Finalize the Calculus problem set for tomorrow\'s submission, then progress Assignment 3 in DSA.',
    blocks: [
      { id: 't1', blockTag: 'P1', blockClass: 'tag-p1', timeType: '6:30 PM – 7:00 PM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Lvl 1 - Due Today', badgeClass: 'conf-level-1', objective: 'Problem Set 4 final solve & self-grading against rubric', recall: 'Closed-book check on final step validations', srSlot: 'Box 1: Taylor series terms', done: false },
      { id: 't2', blockTag: 'P2', blockClass: '', timeType: '7:05 PM – 7:35 PM (25m/5m)', subject: 'Data Structures & Algos (CS 201)', subjBadge: 'Lvl 2 - Project', badgeClass: 'conf-level-2', objective: 'Assignment 3 Problem 2: Graph DFS/BFS cycle detection', recall: 'Draw graph adjacency matrix & trace queue traversal by hand', srSlot: 'Box 2: Graph representations', done: false },
      { id: 't3', blockTag: 'P3', blockClass: '', timeType: '7:45 PM – 8:15 PM (25m/5m)', subject: 'Computer Systems Arch (CS 220)', subjBadge: 'Lvl 3 - Moderate', badgeClass: 'conf-level-3', objective: 'Cache mapping: Direct-mapped vs 2-way set associative index math', recall: 'Solve 2 cache hit/miss traces without looking at formulas', srSlot: 'D-3 Assembly jump instructions', done: false },
      { id: 't4', blockTag: 'SR', blockClass: 'tag-sr', timeType: '8:20 PM – 8:45 PM (25m Spaced Rep)', subject: 'Calculus II (MATH 152)', subjBadge: 'Lvl 1 - Retrieval', badgeClass: 'conf-level-1', objective: 'Flashcard sprint on integral convergence tests (p-series, comparison)', recall: '3-second rapid retrieval per card', srSlot: 'Log 2 stubborn formulas to Bug Log', done: false }
    ]
  },
  wed: {
    heading: 'Wednesday — Deep Problem-Solving & Mid-Week Calibration',
    availability: 'Study Window: 6:00 PM – 9:45 PM (3h 45m)',
    strategy: 'Deep focus on algorithmic coding and hardware architecture lab exercises.',
    blocks: [
      { id: 'w1', blockTag: 'P1', blockClass: 'tag-p1', timeType: '6:00 PM – 6:50 PM (50m Deep Work)', subject: 'Data Structures & Algos (CS 201)', subjBadge: 'Lvl 2 - Deep Dive', badgeClass: 'conf-level-2', objective: 'Assignment 3 Problem 3: Dijkstra\'s Algorithm with Min-Heap', recall: 'Implement algorithm skeleton completely without IDE autocomplete', srSlot: 'D-7 Shortest path edge relaxation', done: false },
      { id: 'w2', blockTag: 'P2', blockClass: '', timeType: '7:00 PM – 7:30 PM (25m/5m)', subject: 'Computer Systems Arch (CS 220)', subjBadge: 'Lvl 3 - Lab', badgeClass: 'conf-level-3', objective: 'Cache Simulation Lab Part 1: Writing hit/miss tracker in C', recall: 'Trace bitmask shifts on paper before compiling', srSlot: 'D-3 Hex to Binary memory offsets', done: false },
      { id: 'w3', blockTag: 'P3', blockClass: '', timeType: '7:35 PM – 8:05 PM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Lvl 1 - Quiz Prep', badgeClass: 'conf-level-1', objective: 'Quiz 2 Mock Session: 3 difficult improper integrals under a 20m timer', recall: 'Exam conditions: strictly no notes or scratchpad aids', srSlot: 'D-1 Yesterday\'s missed problems', done: false },
      { id: 'w4', blockTag: 'SR', blockClass: 'tag-sr', timeType: '8:15 PM – 8:45 PM (30m Spaced Rep)', subject: 'Ethics & Communication (ENG 105)', subjBadge: 'Lvl 4 - Maintenance', badgeClass: 'conf-level-4', objective: 'Draft outline for Algorithmic Bias Case Study', recall: 'Brainstorm 4 core ethical frameworks from memory (Utilitarianism, Kant)', srSlot: 'Weekly maintenance check', done: false }
    ]
  },
  thu: {
    heading: 'Thursday — Mistake Audit ("Bug Log") & Final Submissions',
    availability: 'Study Window: 6:00 PM – 9:15 PM (3h 15m)',
    strategy: 'Finish & submit Assignment 3. Review every single missed problem from past quizzes.',
    blocks: [
      { id: 'th1', blockTag: 'P1', blockClass: 'tag-p1', timeType: '6:00 PM – 6:30 PM (25m/5m)', subject: 'Data Structures & Algos (CS 201)', subjBadge: 'Due Tonight 11:59', badgeClass: 'conf-level-2', objective: 'Assignment 3 Final Test Suite: Edge cases, null inputs, and submission', recall: 'Write 4 stress-test cases from memory', srSlot: 'Pre-flight check against rubric', done: false },
      { id: 'th2', blockTag: 'P2', blockClass: 'tag-p1', timeType: '6:35 PM – 7:05 PM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Quiz Tomorrow!', badgeClass: 'conf-level-1', objective: 'Error Bank Review: Re-solve 4 problems previously marked wrong in HW 1-3', recall: 'Full solution reproduction on clean paper', srSlot: 'Leitner Box 2 sweep', done: false },
      { id: 'th3', blockTag: 'P3', blockClass: '', timeType: '7:15 PM – 7:45 PM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Formula Retrieval', badgeClass: 'conf-level-1', objective: 'Active Recall Blurting: Write every series convergence theorem in 10 mins', recall: 'Blank sheet audit against formula sheet with red ink', srSlot: 'Final Quiz 2 confidence check', done: false },
      { id: 'th4', blockTag: 'SR', blockClass: 'tag-sr', timeType: '7:50 PM – 8:15 PM (25m Spaced Rep)', subject: 'Computer Systems Arch (CS 220)', subjBadge: 'Lvl 3 - Spaced', badgeClass: 'conf-level-3', objective: 'Review flashcard deck on Cache Miss types (Compulsory, Capacity, Conflict)', recall: 'Provide real-world code snippet example for each miss type', srSlot: 'Box 2 consolidation', done: false }
    ]
  },
  fri: {
    heading: 'Friday — Quiz Debrief & Pre-Weekend Synthesis',
    availability: 'Study Window: 5:30 PM – 8:15 PM (2h 45m)',
    strategy: 'Execute Quiz 2 in morning. Friday evening is dedicated to debriefing and light maintenance.',
    blocks: [
      { id: 'f1', blockTag: 'P1', blockClass: '', timeType: '5:30 PM – 6:00 PM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Quiz Debrief', badgeClass: 'conf-level-1', objective: 'Post-quiz recovery: Log any friction points or hesitations into Bug Log', recall: 'Reconstruct the hardest question from memory and solve correctly', srSlot: 'Update Box 1 cards', done: false },
      { id: 'f2', blockTag: 'P2', blockClass: '', timeType: '6:05 PM – 6:35 PM (25m/5m)', subject: 'Computer Systems Arch (CS 220)', subjBadge: 'Lab Progress', badgeClass: 'conf-level-3', objective: 'Cache Simulation Lab Part 2: Implement LRU replacement policy', recall: 'Trace linked list pointer manipulation on whiteboard', srSlot: 'D-3 Cache structures', done: false },
      { id: 'f3', blockTag: 'P3', blockClass: '', timeType: '6:45 PM – 7:15 PM (25m/5m)', subject: 'Technical Ethics & Writing (ENG 105)', subjBadge: 'Lvl 4 - Draft', badgeClass: 'conf-level-4', objective: 'Write 500 words of Case Study Analysis section', recall: 'Cite 3 IEEE code of ethics guidelines without checking notes', srSlot: 'Weekly maintenance complete', done: false },
      { id: 'f4', blockTag: 'SR', blockClass: 'tag-sr', timeType: '7:20 PM – 7:45 PM (25m Spaced Rep)', subject: 'Weekend Prep & Reset', subjBadge: 'Planning', badgeClass: 'conf-level-3', objective: 'Organize practice exam materials for Saturday morning simulation', recall: 'Set clean desk and print mock exams', srSlot: 'Prepare Leitner Box 3 cards', done: false }
    ]
  },
  sat: {
    heading: 'Saturday — Full Timed Simulation & Heavy Practice',
    availability: 'Study Window: 9:30 AM – 1:15 PM (3h 45m)',
    strategy: 'Peak cognitive test: run a full 50-minute timed mock exam under strict exam rules, then audit mistakes.',
    blocks: [
      { id: 's1', blockTag: 'P1', blockClass: 'tag-p1', timeType: '9:30 AM – 10:20 AM (50m Exam Sim)', subject: 'Data Structures & Algos (CS 201)', subjBadge: 'Midterm Sim', badgeClass: 'conf-level-2', objective: 'Complete 2024 Past Midterm Exam (Questions 1 to 5) under timed silence', recall: 'Pure exam conditions: closed book, countdown timer visible', srSlot: 'Full syllabus retrieval', done: false },
      { id: 's2', blockTag: 'P2', blockClass: '', timeType: '10:30 AM – 11:00 AM (25m/5m)', subject: 'Data Structures & Algos (CS 201)', subjBadge: 'Root Cause Audit', badgeClass: 'conf-level-2', objective: 'Score mock exam: categorize lost marks into "Conceptual Gap" vs "Time Rush"', recall: 'Write detailed explanation for every lost point in error journal', srSlot: 'Add missed topics to Box 1', done: false },
      { id: 's3', blockTag: 'P3', blockClass: '', timeType: '11:10 AM – 11:40 AM (25m/5m)', subject: 'Computer Systems Arch (CS 220)', subjBadge: 'Lab Wrap-up', badgeClass: 'conf-level-3', objective: 'Finish Cache Simulator benchmarks and generate output graphs', recall: 'Explain cache miss rate differences between associativity levels', srSlot: 'Lab report submission prep', done: false },
      { id: 's4', blockTag: 'SR', blockClass: 'tag-sr', timeType: '11:45 AM – 12:15 PM (30m Spaced Rep)', subject: 'Cumulative Leitner Sweep (All Subjects)', subjBadge: 'Box 3 Mastery', badgeClass: 'conf-level-4', objective: 'Run 35 flashcards across Math, DSA, and Systems from Box 2 and 3', recall: 'Rapid retrieval (>90% accuracy goal)', srSlot: 'Promote 10 cards to Box 3', done: false }
    ]
  },
  sun: {
    heading: 'Sunday — Synthesis, Spaced Reset & Forward Momentum',
    availability: 'Study Window: 10:00 AM – 1:00 PM & 6:00 PM – 7:30 PM (4h 30m)',
    strategy: 'Tie up loose ends, submit remaining assignments, and map out the coming week.',
    blocks: [
      { id: 'su1', blockTag: 'P1', blockClass: '', timeType: '10:00 AM – 10:30 AM (25m/5m)', subject: 'Computer Systems Arch (CS 220)', subjBadge: 'Due Tonight 11:59', badgeClass: 'conf-level-3', objective: 'Submit Cache Simulation Lab code & 2-page reflection', recall: 'Pre-flight check against submission autograder', srSlot: 'Done', done: false },
      { id: 'su2', blockTag: 'P2', blockClass: '', timeType: '10:35 AM – 11:05 AM (25m/5m)', subject: 'Technical Ethics & Writing (ENG 105)', subjBadge: 'Case Study Polish', badgeClass: 'conf-level-4', objective: 'Final proofread of ethics case study draft for Monday submission', recall: 'Read sentences backwards to catch grammatical bugs', srSlot: 'Submit draft', done: false },
      { id: 'su3', blockTag: 'P3', blockClass: 'tag-p1', timeType: '11:15 AM – 11:45 AM (25m/5m)', subject: 'Calculus II (MATH 152)', subjBadge: 'Next Week Primer', badgeClass: 'conf-level-1', objective: 'Pre-read upcoming lecture chapter: Power Series & Radius of Convergence', recall: 'Generate 3 predictive questions you expect the professor to answer', srSlot: 'Prime memory network', done: false },
      { id: 'su4', blockTag: 'SR', blockClass: 'tag-sr', timeType: '6:00 PM – 6:45 PM (45m Weekly Audit)', subject: 'Weekly Academic Retrospective', subjBadge: 'Coaching Audit', badgeClass: 'conf-level-3', objective: 'Update confidence ratings 1-5, review total Pomodoro counts, adjust next week', recall: 'Reflect on time leaks, celebrate completed milestones', srSlot: 'Set weekly goals', done: false }
    ]
  }
};

const DEFAULT_LEITNER = {
  box1: [
    'Calculus II: Ratio & Root Test condition boundaries',
    'DSA: Dijkstra min-heap time complexity proof (O((V+E)logV))',
    'Sys Arch: 2-way set associative tag/index/offset formula',
    'Calculus II: Geometric series convergence threshold |r| < 1'
  ],
  box2: [
    'DSA: DP optimal substructure vs overlapping subproblems',
    'Sys Arch: 3 C\'s of cache misses (Compulsory, Capacity, Conflict)',
    'Calc II: Integration by parts choice priority (LIATE rule)'
  ],
  box3: [
    'Ethics: IEEE Code of Ethics core canons',
    'DSA: Red-black tree balance invariant rules',
    'Sys Arch: Little-endian vs Big-endian memory byte ordering',
    'Calc II: Fundamental Theorem of Calculus Part 1 & 2'
  ]
};

// ==========================================
// 2. WEB AUDIO SYNTHESIZER & AUDIO FX ENGINE
// ==========================================
class AudioFX {
  static ctx = null;
  static isEnabled = true;

  static init() {
    const saved = localStorage.getItem('study_audio_enabled');
    AudioFX.isEnabled = saved !== null ? saved === 'true' : true;

    const toggleBtn = document.getElementById('sound-toggle-btn');
    if (toggleBtn) {
      AudioFX.updateToggleUI(toggleBtn);
      toggleBtn.addEventListener('click', () => {
        AudioFX.toggleAudio(toggleBtn);
      });
    }

    // Keyboard shortcut 'M' to mute/unmute audio
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'm' || e.key === 'M') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (toggleBtn) AudioFX.toggleAudio(toggleBtn);
      }
    });

    // Global tactile click delegator for interactive elements
    document.addEventListener('click', (e) => {
      if (!AudioFX.isEnabled) return;
      const target = e.target.closest('button, .custom-checkbox, .day-tab, .mode-pill, .card-item, .confidence-slider, .ai-quick-chip');
      if (!target) return;

      if (target.classList.contains('custom-checkbox')) {
        AudioFX.playSuccess();
      } else if (target.classList.contains('day-tab') || target.classList.contains('mode-pill')) {
        AudioFX.playPop();
      } else {
        AudioFX.playClick();
      }
    });
  }

  static getAudioContext() {
    if (!AudioFX.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) AudioFX.ctx = new AudioContextClass();
    }
    if (AudioFX.ctx && AudioFX.ctx.state === 'suspended') {
      AudioFX.ctx.resume();
    }
    return AudioFX.ctx;
  }

  static toggleAudio(btn) {
    AudioFX.isEnabled = !AudioFX.isEnabled;
    localStorage.setItem('study_audio_enabled', AudioFX.isEnabled);
    AudioFX.updateToggleUI(btn);
    if (AudioFX.isEnabled) AudioFX.playPop();
  }

  static updateToggleUI(btn) {
    const icon = document.getElementById('sound-icon');
    const label = document.getElementById('sound-label');
    if (AudioFX.isEnabled) {
      if (icon) icon.textContent = '🔊';
      if (label) label.textContent = 'Audio FX: ON';
      btn.classList.remove('muted');
    } else {
      if (icon) icon.textContent = '🔇';
      if (label) label.textContent = 'Audio FX: OFF';
      btn.classList.add('muted');
    }
  }

  static playClick() {
    if (!AudioFX.isEnabled) return;
    try {
      const ctx = AudioFX.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {
      console.warn('Click audio error:', e);
    }
  }

  static playPop() {
    if (!AudioFX.isEnabled) return;
    try {
      const ctx = AudioFX.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.065);
    } catch (e) {
      console.warn('Pop audio error:', e);
    }
  }

  static playSuccess() {
    if (!AudioFX.isEnabled) return;
    try {
      const ctx = AudioFX.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.16, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } catch (e) {
      console.warn('Success audio error:', e);
    }
  }

  static playChime(isBreak = false) {
    if (!AudioFX.isEnabled) return;
    try {
      const ctx = AudioFX.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = isBreak ? [523.25, 659.25, 783.99] : [783.99, 659.25, 1046.50];

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + (i * 0.12));

        gain.gain.setValueAtTime(0.2, now + (i * 0.12));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.12) + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + (i * 0.12));
        osc.stop(now + (i * 0.12) + 0.65);
      });
    } catch (e) {
      console.warn('Chime audio error:', e);
    }
  }
}

class AudioAlert {
  static playChime(isBreak = false) {
    AudioFX.playChime(isBreak);
  }
}

// ==========================================
// 3. APPLICATION CONTROLLER
// ==========================================
class StudyEngineApp {
  constructor() {
    this.courses = this.loadData('study_courses', DEFAULT_COURSES);
    this.schedule = this.loadData('study_schedule', DEFAULT_SCHEDULE);
    this.leitner = this.loadData('study_leitner', DEFAULT_LEITNER);
    this.migrateSubjects();
    this.currentDay = 'mon';

    // Timer State
    this.timerMode = 'standard'; // 'standard' (25/5), 'deep' (50/10), 'recall' (5)
    this.timerState = 'focus'; // 'focus', 'break'
    this.timerSeconds = 25 * 60;
    this.totalDuration = 25 * 60;
    this.timerInterval = null;
    this.isRunning = false;
    this.pomodoroCount = 1;

    this.initDOM();
    this.bindEvents();
    this.renderAll();
  }

  loadData(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(fallback));
    } catch (e) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  migrateSubjects() {
      const courseNames = this.courses.map(course => course.name);
      const hasPreviousSubjects = courseNames.some(name => !CURRENT_SUBJECTS.includes(name));
      if (hasPreviousSubjects || this.courses.length !== DEFAULT_COURSES.length) {
        this.courses = JSON.parse(JSON.stringify(DEFAULT_COURSES));
        this.saveData('study_courses', this.courses);
      }

      Object.values(this.schedule).forEach(day => {
        day.blocks.forEach(block => {
          const migration = SUBJECT_MIGRATION.find(item => item.match.test(block.subject || ''));
          if (migration) {
            block.subject = migration.subject;
            block.subjBadge = 'Course Focus';
          }
        });
      });
      this.saveData('study_schedule', this.schedule);
  }

  initDOM() {
    // Top panels
    this.coursesContainer = document.getElementById('courses-container');
    this.allocationBar = document.getElementById('allocation-bar');
    this.resetCoursesBtn = document.getElementById('reset-courses-btn');

    // Timer elements
    this.timerLabel = document.getElementById('timer-label');
    this.timerDigits = document.getElementById('timer-time');
    this.timerProgressRing = document.getElementById('timer-progress-ring');
    this.timerToggleBtn = document.getElementById('timer-toggle-btn');
    this.timerBtnIcon = document.getElementById('timer-btn-icon');
    this.timerBtnText = document.getElementById('timer-btn-text');
    this.timerResetBtn = document.getElementById('timer-reset-btn');
    this.timerSkipBtn = document.getElementById('timer-skip-btn');
    this.timerRoundInfo = document.getElementById('timer-round-info');
    this.timerTargetTask = document.getElementById('timer-target-task');
    this.modePills = document.querySelectorAll('.mode-pill');

    // Day tabs
    this.dayTabs = document.querySelectorAll('.day-tab');
    this.currentDayHeading = document.getElementById('current-day-heading');
    this.dayAvailabilityBadge = document.getElementById('day-availability-badge');
    this.currentDayStrategy = document.getElementById('current-day-strategy');
    this.checklistTbody = document.getElementById('checklist-tbody');
    this.markAllBtn = document.getElementById('mark-all-day-btn');
    this.addCustomBlockBtn = document.getElementById('add-custom-block-btn');

    // Stats
    this.overallProgressText = document.getElementById('overall-progress-text');
    this.completedBlocksCount = document.getElementById('completed-blocks-count');
    this.overallProgressBar = document.getElementById('overall-progress-bar');

    // View navigation
    this.viewButtons = {
      schedule: document.getElementById('btn-show-schedule'),
      recall: document.getElementById('btn-show-recall'),
      spaced: document.getElementById('btn-show-spaced')
    };
    this.views = {
      schedule: document.getElementById('schedule-view'),
      recall: document.getElementById('recall-view'),
      spaced: document.getElementById('spaced-view')
    };
    this.askSubjectBasicsBtn = document.getElementById('ask-subject-basics-btn');

    // Active Recall Elements
    this.blurtTextarea = document.getElementById('blurt-textarea');
    this.blurtWordCount = document.getElementById('blurt-word-count');
    this.blurtTopicInput = document.getElementById('blurt-topic-input');
    this.quickBlurtTimerBtn = document.getElementById('quick-blurt-timer-btn');
    this.saveBlurtBtn = document.getElementById('save-blurt-btn');
    this.bugLogList = document.getElementById('bug-log-list');
    this.addBugBtn = document.getElementById('add-bug-btn');

    // Spaced Repetition Elements
    this.box1Container = document.getElementById('box-1-items');
    this.box2Container = document.getElementById('box-2-items');
    this.box3Container = document.getElementById('box-3-items');
    this.b1Count = document.getElementById('b1-count');
    this.b2Count = document.getElementById('b2-count');
    this.b3Count = document.getElementById('b3-count');
    this.addSrItemBtn = document.getElementById('add-sr-item-btn');

    // Modal
    this.addBlockModal = document.getElementById('add-block-modal');
    this.modalCloseBtn = document.getElementById('modal-close-btn');
    this.modalCancelBtn = document.getElementById('modal-cancel-btn');
    this.addBlockForm = document.getElementById('add-block-form');
    this.modalDaySelect = document.getElementById('modal-day');
  }

  bindEvents() {
    // Day navigation
    this.dayTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const day = tab.dataset.day;
        this.switchDay(day);
      });
    });

    // View toggling
    Object.keys(this.viewButtons).forEach(viewKey => {
      this.viewButtons[viewKey].addEventListener('click', () => {
        this.switchView(viewKey);
      });

      if (this.askSubjectBasicsBtn) {
        this.askSubjectBasicsBtn.addEventListener('click', () => {
          if (window.studyApp.aiChat) {
            window.studyApp.aiChat.openChat();
            window.studyApp.aiChat.input.value = 'Give me the basic meaning of all five subjects with one simple example each';
            window.studyApp.aiChat.handleUserSubmit();
          }
        });
      }
    });

    // Check all current day
    this.markAllBtn.addEventListener('click', () => {
      const dayData = this.schedule[this.currentDay];
      const allDone = dayData.blocks.every(b => b.done);
      dayData.blocks.forEach(b => { b.done = !allDone; });
      this.saveData('study_schedule', this.schedule);
      this.renderDayChecklist();
      this.updateOverallStats();
    });

    // Reset courses
    this.resetCoursesBtn.addEventListener('click', () => {
      if (confirm('Reset courses to default academic coach settings?')) {
        this.courses = JSON.parse(JSON.stringify(DEFAULT_COURSES));
        this.saveData('study_courses', this.courses);
        this.renderCourses();
      }
    });

    // Timer controls
    this.timerToggleBtn.addEventListener('click', () => this.toggleTimer());
    this.timerResetBtn.addEventListener('click', () => this.resetTimer());
    this.timerSkipBtn.addEventListener('click', () => this.skipTimerPhase());

    this.modePills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.modePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.setTimerMode(pill.dataset.mode);
      });
    });

    // Active Recall textarea counter
    this.blurtTextarea.addEventListener('input', () => {
      const text = this.blurtTextarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      this.blurtWordCount.textContent = words;
    });

    // Quick blurt timer shortcut
    this.quickBlurtTimerBtn.addEventListener('click', () => {
      this.setTimerMode('recall');
      this.startTimer();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Save blurt to bug log
    this.saveBlurtBtn.addEventListener('click', () => {
      const topic = this.blurtTopicInput.value.trim();
      const words = this.blurtWordCount.textContent;
      if (!topic) {
        alert('Please specify the topic or concept name first.');
        return;
      }
      this.addBugItem('General', `Blurting audited for "${topic}": ${words} words retrieved. Review identified knowledge gaps.`);
      alert(`Topic "${topic}" logged to Bug Log for review.`);
      this.blurtTopicInput.value = '';
      this.blurtTextarea.value = '';
      this.blurtWordCount.textContent = '0';
    });

    this.addBugBtn.addEventListener('click', () => {
      const desc = prompt('Enter weakness, formula error, or mistake observed:');
      if (desc) {
        this.addBugItem('Mistake', desc);
      }
    });

    // Spaced repetition add
    this.addSrItemBtn.addEventListener('click', () => {
      const topic = prompt('Enter concept / theorem / flashcard prompt to add to Box 1:');
      if (topic) {
        this.leitner.box1.unshift(topic);
        this.saveData('study_leitner', this.leitner);
        this.renderLeitner();
      }
    });

    // Modal controls
    this.addCustomBlockBtn.addEventListener('click', () => {
      this.modalDaySelect.value = this.currentDay;
      this.addBlockModal.classList.remove('hidden');
    });

    this.modalCloseBtn.addEventListener('click', () => this.addBlockModal.classList.add('hidden'));
    this.modalCancelBtn.addEventListener('click', () => this.addBlockModal.classList.add('hidden'));

    this.addBlockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetDay = this.modalDaySelect.value;
      const newBlock = {
        id: 'cb_' + Date.now(),
        blockTag: 'Custom',
        blockClass: '',
        timeType: document.getElementById('modal-time').value,
        subject: document.getElementById('modal-course').value,
        subjBadge: 'Custom',
        badgeClass: 'conf-level-3',
        objective: document.getElementById('modal-task').value,
        recall: document.getElementById('modal-recall').value,
        srSlot: document.getElementById('modal-sr').value || 'Standard Review',
        done: false
      };

      this.schedule[targetDay].blocks.push(newBlock);
      this.saveData('study_schedule', this.schedule);
      this.addBlockForm.reset();
      this.addBlockModal.classList.add('hidden');
      
      if (this.currentDay === targetDay) {
        this.renderDayChecklist();
      }
      this.updateOverallStats();
    });
  }

  // ==========================================
  // 4. RENDERERS
  // ==========================================
  renderAll() {
    this.renderCourses();
    this.renderDayChecklist();
    this.renderLeitner();
    this.updateOverallStats();
    this.updateTimerDisplay();
  }

  renderCourses() {
    this.coursesContainer.innerHTML = '';

    // Calculate total weights based on inverted confidence (Confidence 1 = weight 5, Confidence 5 = weight 1)
    const weights = this.courses.map(c => Math.max(1, 6 - c.confidence));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    this.courses.forEach((course, index) => {
      const percentage = Math.round((weights[index] / totalWeight) * 100);
      const row = document.createElement('div');
      row.className = 'course-row-item';

      let badgeClass = `conf-level-${course.confidence}`;
      let confLabel = `Level ${course.confidence} / 5`;
      if (course.confidence === 1) confLabel = 'Level 1 (Highest Priority)';
      if (course.confidence >= 4) confLabel = 'Level 4 (Maintenance)';

      row.innerHTML = `
        <div class="course-info">
          <span class="course-name">${course.name}</span>
          <span class="course-deadline">${course.deadline}</span>
        </div>
        <div class="course-confidence-slider-wrap">
          <input type="range" class="confidence-slider" min="1" max="5" value="${course.confidence}" data-index="${index}">
        </div>
        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
          <span class="confidence-badge ${badgeClass}">${confLabel}</span>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--text-highlight);">${percentage}%</span>
        </div>
      `;

      // Slider change event
      const slider = row.querySelector('.confidence-slider');
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.courses[index].confidence = val;
        this.saveData('study_courses', this.courses);
        this.renderCourses();
      });

      this.coursesContainer.appendChild(row);
    });

    // Render allocation bar
    this.allocationBar.innerHTML = '';
    const colorPalette = ['#f43f5e', '#f59e0b', '#6366f1', '#10b981'];
    this.courses.forEach((course, index) => {
      const pct = Math.round((weights[index] / totalWeight) * 100);
      const segment = document.createElement('div');
      segment.className = 'alloc-segment';
      segment.style.width = `${pct}%`;
      segment.style.backgroundColor = colorPalette[index % colorPalette.length];
      segment.setAttribute('data-tooltip', `${course.name.split(' ')[0]}: ${pct}% study time`);
      this.allocationBar.appendChild(segment);
    });
  }

  renderDayChecklist() {
    const dayData = this.schedule[this.currentDay];
    if (!dayData) return;

    this.currentDayHeading.textContent = dayData.heading;
    this.dayAvailabilityBadge.textContent = dayData.availability;
    this.currentDayStrategy.textContent = dayData.strategy;

    this.checklistTbody.innerHTML = '';

    dayData.blocks.forEach((block, idx) => {
      const tr = document.createElement('tr');
      tr.className = `table-row ${block.done ? 'row-completed' : ''}`;
      
      tr.innerHTML = `
        <td style="text-align: center;">
          <div class="custom-checkbox ${block.done ? 'checked' : ''}" data-index="${idx}"></div>
        </td>
        <td>
          <span class="block-tag ${block.blockClass}">${block.blockTag}</span>
        </td>
        <td>
          <div class="time-type-wrap">
            <span class="time-val">${block.timeType}</span>
            <span class="interval-desc">Pomodoro Synchronized</span>
          </div>
        </td>
        <td>
          <div class="subject-wrap">
            <span class="subj-name">
              ${block.subject}
            </span>
            <span class="task-objective">${block.objective}</span>
          </div>
        </td>
        <td>
          <div class="recall-protocol-cell">
            ${block.recall}
          </div>
        </td>
        <td>
          <span class="sr-slot-cell">${block.srSlot}</span>
        </td>
        <td>
          <div class="action-btn-row">
            <button class="btn-icon-action btn-link-timer" data-index="${idx}" title="Set Timer for this Block">⏱️ Start</button>
            <button class="btn-icon-action btn-delete-row" data-index="${idx}" title="Remove Block">🗑️</button>
          </div>
        </td>
      `;

      // Checkbox click
      const chk = tr.querySelector('.custom-checkbox');
      chk.addEventListener('click', () => {
        block.done = !block.done;
        this.saveData('study_schedule', this.schedule);
        this.renderDayChecklist();
        this.updateOverallStats();
      });

      // Quick start timer for this block
      const linkBtn = tr.querySelector('.btn-link-timer');
      linkBtn.addEventListener('click', () => {
        this.timerTargetTask.textContent = `${block.blockTag}: ${block.subject} — ${block.objective}`;
        if (block.timeType.includes('50m')) {
          this.setTimerMode('deep');
        } else {
          this.setTimerMode('standard');
        }
        this.startTimer();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // Delete block
      const delBtn = tr.querySelector('.btn-delete-row');
      delBtn.addEventListener('click', () => {
        if (confirm(`Remove this block (${block.blockTag})?`)) {
          dayData.blocks.splice(idx, 1);
          this.saveData('study_schedule', this.schedule);
          this.renderDayChecklist();
          this.updateOverallStats();
        }
      });

      this.checklistTbody.appendChild(tr);
    });

    this.updateDayBadges();
    if (this.aiChat) this.aiChat.updateTelemetry();
  }

  renderLeitner() {
    // Box 1
    this.box1Container.innerHTML = '';
    this.b1Count.textContent = `${this.leitner.box1.length} Topics`;
    this.leitner.box1.forEach((item, index) => {
      this.box1Container.appendChild(this.createCardItem(item, 1, index));
    });

    // Box 2
    this.box2Container.innerHTML = '';
    this.b2Count.textContent = `${this.leitner.box2.length} Topics`;
    this.leitner.box2.forEach((item, index) => {
      this.box2Container.appendChild(this.createCardItem(item, 2, index));
    });

    // Box 3
    this.box3Container.innerHTML = '';
    this.b3Count.textContent = `${this.leitner.box3.length} Topics`;
    this.leitner.box3.forEach((item, index) => {
      this.box3Container.appendChild(this.createCardItem(item, 3, index));
    });
  }

  createCardItem(text, boxNum, index) {
    const card = document.createElement('div');
    card.className = 'card-item';
    
    let moveButtons = '';
    if (boxNum === 1) {
      moveButtons = `<button class="btn-card-move move-up" title="Promote to Box 2">Advance →</button>`;
    } else if (boxNum === 2) {
      moveButtons = `
        <button class="btn-card-move move-down" title="Demote to Box 1">← Box 1</button>
        <button class="btn-card-move move-up" title="Promote to Box 3">Box 3 →</button>
      `;
    } else if (boxNum === 3) {
      moveButtons = `<button class="btn-card-move move-down" title="Demote if forgotten">← Review Again</button>`;
    }

    card.innerHTML = `
      <span class="card-topic-text">${text}</span>
      <div class="card-actions">
        ${moveButtons}
        <button class="btn-card-move card-delete" title="Delete">✕</button>
      </div>
    `;

    // Move handlers
    const upBtn = card.querySelector('.move-up');
    if (upBtn) {
      upBtn.addEventListener('click', () => {
        if (boxNum === 1) {
          this.leitner.box1.splice(index, 1);
          this.leitner.box2.unshift(text);
        } else if (boxNum === 2) {
          this.leitner.box2.splice(index, 1);
          this.leitner.box3.unshift(text);
        }
        this.saveData('study_leitner', this.leitner);
        this.renderLeitner();
      });
    }

    const downBtn = card.querySelector('.move-down');
    if (downBtn) {
      downBtn.addEventListener('click', () => {
        if (boxNum === 2) {
          this.leitner.box2.splice(index, 1);
          this.leitner.box1.unshift(text);
        } else if (boxNum === 3) {
          this.leitner.box3.splice(index, 1);
          this.leitner.box1.unshift(text);
        }
        this.saveData('study_leitner', this.leitner);
        this.renderLeitner();
      });
    }

    const delBtn = card.querySelector('.card-delete');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        if (boxNum === 1) this.leitner.box1.splice(index, 1);
        if (boxNum === 2) this.leitner.box2.splice(index, 1);
        if (boxNum === 3) this.leitner.box3.splice(index, 1);
        this.saveData('study_leitner', this.leitner);
        this.renderLeitner();
      });
    }

    return card;
  }

  addBugItem(tag, desc) {
    const item = document.createElement('div');
    item.className = 'bug-item';
    item.innerHTML = `
      <span class="bug-tag cs">${tag}</span>
      <p class="bug-desc">${desc}</p>
      <span class="bug-fix">Remedy: Added to Box 1 Spaced Review</span>
    `;
    this.bugLogList.prepend(item);
  }

  // ==========================================
  // 5. NAVIGATION & VIEWS
  // ==========================================
  switchDay(day) {
    this.currentDay = day;
    this.dayTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.day === day);
    });
    this.renderDayChecklist();
  }

  switchView(activeKey) {
    Object.keys(this.viewButtons).forEach(key => {
      this.viewButtons[key].classList.toggle('active', key === activeKey);
    });
    Object.keys(this.views).forEach(key => {
      this.views[key].classList.toggle('active', key === activeKey);
    });
  }

  updateDayBadges() {
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(day => {
      const badge = document.getElementById(`badge-${day}`);
      if (badge && this.schedule[day]) {
        const blocks = this.schedule[day].blocks;
        const done = blocks.filter(b => b.done).length;
        badge.textContent = `${done}/${blocks.length}`;
      }
    });
  }

  updateOverallStats() {
    let totalBlocks = 0;
    let completedBlocks = 0;

    Object.values(this.schedule).forEach(day => {
      day.blocks.forEach(b => {
        totalBlocks++;
        if (b.done) completedBlocks++;
      });
    });

    const pct = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
    this.overallProgressText.textContent = `${pct}%`;
    this.completedBlocksCount.textContent = `${completedBlocks}/${totalBlocks} Blocks`;
    this.overallProgressBar.style.width = `${pct}%`;

    this.updateDayBadges();
  }

  createDataSnapshot() {
    const snapshot = {
      version: 1,
      exportedAt: new Date().toISOString(),
      courses: this.courses,
      schedule: this.schedule,
      leitner: this.leitner,
      currentUser: window.studyUser ? window.studyUser.currentUser : null,
      sessionLogs: window.studyUser ? window.studyUser.sessionLogs : [],
      lifetimeSeconds: window.studyUser ? window.studyUser.lifetimeSeconds : 0,
      todaySeconds: window.studyUser ? window.studyUser.todaySeconds : 0,
      todayDate: window.studyUser ? window.studyUser.todayDateStr : new Date().toISOString().split('T')[0]
    };
    return snapshot;
  }

  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportData(format) {
    const snapshot = this.createDataSnapshot();
    const stamp = new Date().toISOString().slice(0, 10);

    if (format === 'json') {
      this.downloadFile(JSON.stringify(snapshot, null, 2), `study-engine-backup-${stamp}.json`, 'application/json');
      return;
    }

    const rows = [['Day', 'Block', 'Subject', 'Objective', 'Time', 'Completed']];
    Object.entries(snapshot.schedule).forEach(([day, dayData]) => {
      dayData.blocks.forEach(block => {
        rows.push([dayData.heading, block.blockTag, block.subject, block.objective, block.timeType, block.done ? 'Yes' : 'No']);
      });
    });
    const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    this.downloadFile(csv, `study-engine-schedule-${stamp}.csv`, 'text/csv;charset=utf-8');
  }

  importData(file) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!imported || imported.version !== 1 || !imported.schedule || !imported.courses || !imported.leitner) {
          throw new Error('This file is not a valid Study Engine backup.');
        }

        this.courses = imported.courses;
        this.schedule = imported.schedule;
        this.leitner = imported.leitner;
        this.saveData('study_courses', this.courses);
        this.saveData('study_schedule', this.schedule);
        this.saveData('study_leitner', this.leitner);

        if (window.studyUser) {
          if (imported.currentUser) window.studyUser.saveCurrentUser(imported.currentUser);
          if (Array.isArray(imported.sessionLogs)) {
            window.studyUser.sessionLogs = imported.sessionLogs;
            window.studyUser.saveSessionLogs();
          }
          if (Number.isFinite(imported.lifetimeSeconds)) {
            window.studyUser.lifetimeSeconds = imported.lifetimeSeconds;
            localStorage.setItem('study_lifetime_seconds', String(imported.lifetimeSeconds));
          }
          if (Number.isFinite(imported.todaySeconds) && imported.todayDate) {
            localStorage.setItem(`study_today_${imported.todayDate}`, String(imported.todaySeconds));
          }
        }

        alert('Study Engine backup imported successfully. Reloading your restored dashboard.');
        window.location.reload();
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    });
    reader.addEventListener('error', () => alert('Import failed: the backup file could not be read.'));
    reader.readAsText(file);
  }

  // ==========================================
  // 6. POMODORO TIMER CORE
  // ==========================================
  setTimerMode(mode) {
    this.timerMode = mode;
    this.timerState = 'focus';
    this.pauseTimer();

    if (mode === 'standard') {
      this.totalDuration = 25 * 60;
    } else if (mode === 'deep') {
      this.totalDuration = 50 * 60;
    } else if (mode === 'recall') {
      this.totalDuration = 5 * 60;
    }

    this.timerSeconds = this.totalDuration;
    this.timerLabel.textContent = mode === 'recall' ? 'ACTIVE RECALL BLURT' : 'FOCUS INTERVAL';
    this.updateTimerDisplay();
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.timerBtnIcon.textContent = '⏸';
    this.timerBtnText.textContent = 'Pause Interval';

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    this.timerBtnIcon.textContent = '▶';
    this.timerBtnText.textContent = 'Resume Focus';
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSeconds = this.totalDuration;
    this.updateTimerDisplay();
  }

  skipTimerPhase() {
    this.pauseTimer();
    if (this.timerState === 'focus') {
      this.timerState = 'break';
      const breakDuration = this.timerMode === 'deep' ? 10 * 60 : 5 * 60;
      this.totalDuration = breakDuration;
      this.timerSeconds = breakDuration;
      this.timerLabel.textContent = 'COGNITIVE REST BREAK';
      AudioAlert.playChime(true);
    } else {
      this.timerState = 'focus';
      this.pomodoroCount++;
      this.timerRoundInfo.textContent = `Pomodoro ${this.pomodoroCount} of 4`;
      const focusDuration = this.timerMode === 'deep' ? 50 * 60 : 25 * 60;
      this.totalDuration = focusDuration;
      this.timerSeconds = focusDuration;
      this.timerLabel.textContent = 'FOCUS INTERVAL';
      AudioAlert.playChime(false);
    }
    this.updateTimerDisplay();
  }

  tick() {
    if (this.timerSeconds > 0) {
      this.timerSeconds--;
      this.updateTimerDisplay();
    } else {
      // Phase complete
      if (this.timerState === 'focus') {
        AudioAlert.playChime(true);
        alert('🎉 Focus block finished! Step away from screens for a 5-minute neuro-reset.');
        this.skipTimerPhase();
      } else {
        AudioAlert.playChime(false);
        alert('⚡ Break over! Ready for the next active recall / problem block.');
        this.skipTimerPhase();
      }
    }
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.timerDigits.textContent = formatted;

    // SVG Circle progress ring calculation
    // Circle radius = 95, circumference = 2 * PI * 95 ≈ 596.90
    const circumference = 596.9;
    const progress = (this.totalDuration - this.timerSeconds) / this.totalDuration;
    const offset = circumference * (1 - progress);
    this.timerProgressRing.style.strokeDashoffset = offset;
  }
}

// ==========================================
// 6. AI ACADEMIC COACH & CHAT ASSISTANT
// ==========================================
class AcademicAIChat {
  constructor(studyApp) {
    this.app = studyApp;
    this.storageKey = 'study_ai_chat_history';
    this.history = this.loadHistory();
    this.isOpen = false;
    this.isGenerating = false;

    this.initDOM();
    this.bindEvents();
    this.renderHistory();
    this.updateTelemetry();
  }

  initDOM() {
    this.launcher = document.getElementById('ai-chat-launcher');
    this.window = document.getElementById('ai-chat-window');
    this.closeBtn = document.getElementById('ai-chat-minimize');
    this.clearBtn = document.getElementById('ai-chat-clear');
    this.messagesContainer = document.getElementById('ai-chat-messages');
    this.form = document.getElementById('ai-chat-form');
    this.input = document.getElementById('ai-chat-input');
    this.sendBtn = document.getElementById('ai-chat-send-btn');
    this.chips = document.querySelectorAll('.ai-quick-chip');

    // Telemetry display elements
    this.telemetryDay = document.getElementById('ai-telemetry-day');
    this.telemetryTask = document.getElementById('ai-telemetry-task');
    this.telemetryTimer = document.getElementById('ai-telemetry-timer');
  }

  bindEvents() {
    if (this.launcher) {
      this.launcher.addEventListener('click', () => this.toggleChat());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeChat());
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        if (confirm('Clear chat conversation history?')) {
          this.history = [];
          this.saveHistory();
          this.renderHistory();
        }
      });
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserSubmit();
      });
    }

    if (this.input) {
      // Enter to send, Shift+Enter for newline
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSubmit();
        }
      });

      // Auto-grow textarea
      this.input.addEventListener('input', () => {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 90) + 'px';
      });
    }

    // Quick chip buttons
    if (this.chips) {
      this.chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const query = chip.dataset.query || chip.textContent.trim();
          if (this.input) {
            this.input.value = query;
          }
          this.handleUserSubmit();
        });
      });
    }
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    if (this.window) {
      this.window.classList.remove('hidden');
      this.window.setAttribute('aria-hidden', 'false');
    }
    this.updateTelemetry();
    this.scrollToBottom();
    if (this.input) {
      setTimeout(() => this.input.focus(), 150);
    }
  }

  closeChat() {
    this.isOpen = false;
    if (this.window) {
      this.window.classList.add('hidden');
      this.window.setAttribute('aria-hidden', 'true');
    }
  }

  loadHistory() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error loading chat history:', e);
    }

    // Default welcoming message
    return [
      {
        role: 'assistant',
    content: `👋 **Welcome to your AI Subject Teacher!**\n\nI can help with any educational topic, including explanations, examples, problem solving, code, quizzes, and study planning. I can also use your current study plan when you ask what to study next.`,
        timestamp: Date.now()
      }
    ];
  }

  saveHistory() {
    try {
      // Keep up to last 40 messages to maintain speed
      const trimmed = this.history.slice(-40);
      localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Error saving chat history:', e);
    }
  }

  updateTelemetry() {
    if (!this.app) return;

    // Current day
    const dayNames = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
    const currentDayKey = this.app.currentDay || 'mon';
    if (this.telemetryDay) {
      this.telemetryDay.textContent = `📅 ${dayNames[currentDayKey] || currentDayKey}`;
    }

    // Next pending block
    const dayData = this.app.schedule ? this.app.schedule[currentDayKey] : null;
    let nextTaskTitle = 'All Done';
    if (dayData && dayData.blocks) {
      const pending = dayData.blocks.find(b => !b.done);
      if (pending) {
        const shortSubj = pending.subject.split('(')[0].trim();
        nextTaskTitle = `🎯 ${shortSubj}`;
      }
    }
    if (this.telemetryTask) {
      this.telemetryTask.textContent = nextTaskTitle;
    }

    // Timer status
    if (this.telemetryTimer) {
      const mins = Math.floor((this.app.timerSeconds || 0) / 60);
      const state = this.app.isRunning ? 'Running' : 'Ready';
      this.telemetryTimer.textContent = `⏱️ ${mins}m (${state})`;
    }
  }

  renderHistory() {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = '';
    this.history.forEach(msg => {
      this.renderMessageElement(msg);
    });
    this.scrollToBottom();
  }

  renderMessageElement(msg) {
    const row = document.createElement('div');
    row.className = `ai-message ${msg.role}`;

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.innerHTML = this.formatMarkdown(msg.content);

    // If there is an attached action
    if (msg.action && msg.action.type) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'ai-action-btn';
      actionBtn.innerHTML = msg.action.label || 'Execute Action';
      actionBtn.addEventListener('click', () => {
        this.executeAppAction(msg.action);
      });
      bubble.appendChild(actionBtn);
    }

    const timeSpan = document.createElement('span');
    timeSpan.className = 'ai-msg-time';
    const date = msg.timestamp ? new Date(msg.timestamp) : new Date();
    timeSpan.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.appendChild(bubble);
    row.appendChild(timeSpan);
    this.messagesContainer.appendChild(row);
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Badges: [URGENT], [DONE], [PRIORITY]
    html = html.replace(/\[URGENT\]/g, '<span class="ai-badge ai-badge-urgent">URGENT</span>');
    html = html.replace(/\[HIGH PRIORITY\]/g, '<span class="ai-badge ai-badge-urgent">HIGH PRIORITY</span>');
    html = html.replace(/\[SUCCESS\]/g, '<span class="ai-badge ai-badge-success">COMPLETED</span>');
    html = html.replace(/\[STRATEGY\]/g, '<span class="ai-badge ai-badge-info">STRATEGY</span>');

    // Bullet lists: split lines
    const lines = html.split('\n');
    let inList = false;
    const processed = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          processed.push('<ul>');
          inList = true;
        }
        processed.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          processed.push('</ul>');
          inList = false;
        }
        if (trimmed.length > 0) {
          processed.push(`<p>${line}</p>`);
        }
      }
    });
    if (inList) {
      processed.push('</ul>');
    }

    return processed.join('');
  }

  handleUserSubmit() {
    if (!this.input) return;
    const text = this.input.value.trim();
    if (!text || this.isGenerating) return;

    // Add user message
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    this.history.push(userMsg);
    this.renderMessageElement(userMsg);
    this.saveHistory();

    // Reset input
    this.input.value = '';
    this.input.style.height = 'auto';
    this.scrollToBottom();

    // Generate AI response
    this.generateResponse(text);
  }

  getStudyContext() {
    const currentDay = this.app && this.app.currentDay ? this.app.currentDay : 'mon';
    const currentDaySchedule = this.app && this.app.schedule
      ? this.app.schedule[currentDay]
      : null;
    const pendingTasks = currentDaySchedule && Array.isArray(currentDaySchedule.blocks)
      ? currentDaySchedule.blocks
        .filter(block => !block.done)
        .map(block => ({
          block: block.blockTag,
          time: block.timeType,
          subject: block.subject,
          objective: block.objective,
          recall: block.recall,
          spacedRepetition: block.srSlot
        }))
      : [];

    return {
      currentDay,
      courses: this.app && Array.isArray(this.app.courses)
        ? this.app.courses.map(course => ({
          name: course.name,
          confidence: course.confidence,
          deadline: course.deadline
        }))
        : [],
      schedule: currentDaySchedule
        ? {
          heading: currentDaySchedule.heading,
          availability: currentDaySchedule.availability,
          strategy: currentDaySchedule.strategy
        }
        : {},
      pendingTasks,
      leitner: this.app && this.app.leitner
        ? {
          box1: this.app.leitner.box1 || [],
          box2: this.app.leitner.box2 || [],
          box3: this.app.leitner.box3 || []
        }
        : {},
      timer: this.app
        ? {
          mode: this.app.timerMode,
          state: this.app.timerState,
          minutesRemaining: Math.ceil((this.app.timerSeconds || 0) / 60),
          running: Boolean(this.app.isRunning),
          targetTask: this.app.timerTargetTask ? this.app.timerTargetTask.textContent : ''
        }
        : {}
    };
  }

  showTypingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'ai-message assistant';
    wrap.id = 'ai-typing-indicator';
    wrap.innerHTML = `
      <div class="ai-typing-wrap">
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
      </div>
    `;
    this.messagesContainer.appendChild(wrap);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const el = document.getElementById('ai-typing-indicator');
    if (el) el.remove();
  }

  async generateResponse(userQuery) {
    this.isGenerating = true;
    this.showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userQuery,
          studyContext: this.getStudyContext()
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Chat request failed with status ${response.status}`);
      }
      if (typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Chat response did not include a reply.');
      }

      this.hideTypingIndicator();
      // Preserve existing planner actions while Gemini supplies the natural-language answer.
      const contextualAction = this.computeContextualResponse(userQuery).action || null;

      const aiMsg = {
        role: 'assistant',
        content: data.reply,
        action: contextualAction,
        timestamp: Date.now()
      };

      this.history.push(aiMsg);
      this.renderMessageElement(aiMsg);
      this.saveHistory();
      this.scrollToBottom();
      this.updateTelemetry();
    } catch (error) {
      console.error('AI chat request failed:', error);
      this.hideTypingIndicator();
      const errorMsg = {
        role: 'assistant',
        content: `⚠️ ${error.message || "I couldn't connect to the AI service. Please make sure the AI server is running."}`,
        timestamp: Date.now()
      };
      this.history.push(errorMsg);
      this.renderMessageElement(errorMsg);
      this.saveHistory();
      this.scrollToBottom();
    } finally {
      this.isGenerating = false;
    }
  }

  // ==========================================
  // CONTEXT-AWARE INTELLIGENCE ENGINE
  // ==========================================
  computeContextualResponse(rawQuery) {
    const query = rawQuery.toLowerCase();
    const courses = (this.app && this.app.courses && this.app.courses.length > 0) ? this.app.courses : DEFAULT_COURSES;
    const schedule = (this.app && this.app.schedule) ? this.app.schedule : DEFAULT_SCHEDULE;
    const currentDay = (this.app && this.app.currentDay) ? this.app.currentDay : 'mon';
    const dayData = schedule[currentDay] || DEFAULT_SCHEDULE[currentDay];
    const leitner = (this.app && this.app.leitner) ? this.app.leitner : DEFAULT_LEITNER;

    // Day aliases mapping
    const dayMap = {
      monday: 'mon', mon: 'mon',
      tuesday: 'tue', tue: 'tue', tues: 'tue',
      wednesday: 'wed', wed: 'wed',
      thursday: 'thu', thu: 'thu', thurs: 'thu',
      friday: 'fri', fri: 'fri',
      saturday: 'sat', sat: 'sat',
      sunday: 'sun', sun: 'sun'
    };

    // Check if the user is asking about a specific day of the week
    let matchedDayKey = null;
    let matchedDayName = null;
    for (const [name, key] of Object.entries(dayMap)) {
      // Look for whole word or clear mention of the day name
      const regex = new RegExp(`\\b${name}\\b`, 'i');
      if (regex.test(query)) {
        matchedDayKey = key;
        matchedDayName = name.charAt(0).toUpperCase() + name.slice(1);
        break;
      }
    }

    // 1. SPECIFIC DAY QUERY (e.g. "What do I have on Tuesday?", "What's due on Friday?")
    if (matchedDayKey && (query.includes('due') || query.includes('schedule') || query.includes('have') || query.includes('plan') || query.includes('what') || query.includes('show') || query.includes('task') || query.includes('blocks'))) {
      const targetDayData = schedule[matchedDayKey];
      if (targetDayData && targetDayData.blocks) {
        let msg = `📅 **${matchedDayName}'s Study Plan & Schedule:**\n\n`;
        msg += `- **Focus:** *${targetDayData.heading}*\n`;
        msg += `- **Study Window:** ${targetDayData.availability}\n`;
        msg += `- **Strategy:** ${targetDayData.strategy}\n\n`;
        msg += `**Scheduled Blocks (${targetDayData.blocks.length} total):**\n`;

        targetDayData.blocks.forEach(b => {
          const status = b.done ? '✅ [COMPLETED]' : '⏳';
          const badge = b.subjBadge ? ` *(${b.subjBadge})*` : '';
          msg += `- ${status} **${b.blockTag}** (${b.timeType}): **${b.subject}**${badge}\n  *Task:* ${b.objective}\n  *Recall Protocol:* <code>${b.recall}</code>\n`;
        });

        return {
          text: msg,
          action: {
            type: 'switch_day',
            day: matchedDayKey,
            label: `📅 Switch Main View to ${matchedDayName}`
          }
        };
      }
    }

    // 2. TODAY / NEXT TASK QUERY
    if (query.includes('next') || query.includes('today') || query.includes('right now') || query.includes('what should i study') || query.includes('what to do')) {
      if (!dayData || !dayData.blocks || dayData.blocks.length === 0) {
        return {
          text: `You don't have any study blocks scheduled for **${currentDay.toUpperCase()}**. Use the **+ Add Block** button to create one!`
        };
      }

      const pendingBlocks = dayData.blocks.filter(b => !b.done);
      const completedCount = dayData.blocks.length - pendingBlocks.length;
      const totalCount = dayData.blocks.length;

      if (pendingBlocks.length === 0) {
        return {
          text: `🎉 [SUCCESS] **All blocks for ${currentDay.toUpperCase()} are completed (${totalCount}/${totalCount})!**\n\n- Fantastic execution today! Your cognitive retention increases when resting after high focus.\n- Review your Leitner spaced repetition flashcards or preview tomorrow's schedule when you're ready.`
        };
      }

      const next = pendingBlocks[0];
      return {
        text: `⚡ **Next Scheduled Block for Today (${currentDay.toUpperCase()}):**\n\n- **Subject:** ${next.subject} (${next.blockTag})\n- **Time Window:** ${next.timeType}\n- **Primary Objective:** ${next.objective}\n- **Active Recall Method:** <code>${next.recall}</code>\n- **Spaced Rep Slot:** ${next.srSlot}\n\n*Progress today: ${completedCount}/${totalCount} blocks completed.* Ready to begin?`,
        action: {
          type: 'start_block_timer',
          block: next,
          label: `⏱️ Launch Timer for "${next.blockTag}: ${next.subject.split('(')[0].trim()}"`
        }
      };
    }

    // 3. URGENT DEADLINES & COURSE CONFIDENCE
    if (query.includes('deadline') || query.includes('course') || query.includes('urgent') || query.includes('priority') || query.includes('due') || query.includes('matrix')) {
      const sorted = [...courses].sort((a, b) => a.confidence - b.confidence);
      const level1Courses = sorted.filter(c => c.confidence === 1);

      let summary = `🚨 **Course Priority & Upcoming Deadlines:**\n\n`;
      sorted.forEach(c => {
        const badge = c.confidence <= 2 ? '[HIGH PRIORITY]' : '[STRATEGY]';
        summary += `- **${c.name}** (Level ${c.confidence}/5) ${badge}\n  *Deadline:* ${c.deadline}\n`;
      });

      summary += `\n💡 *Coach Strategy:* Under the 50/30/20 cognitive rule, allocate at least **50% of your total study time** to your Level 1 & 2 weak spots (**${level1Courses.map(c => c.name.split(' ')[0]).join(', ') || 'Calculus II'}**).`;

      return { text: summary };
    }

    // 4. ACTIVE RECALL & FEYNMAN TECHNIQUE
    if (query.includes('recall') || query.includes('feynman') || query.includes('blurt') || query.includes('retention') || query.includes('checkpoint')) {
      return {
        text: `🧠 **Active Recall Checkpoint Protocol:**\n\n1. **Closed-Book Feynman Blurt:** Close all textbook tabs and notes. Grab a clean sheet or use the built-in *Active Recall Studio*.\n2. **Vocalize & Write:** Write down the core theorem, algorithm, or memory formula in plain English as if explaining it to a novice.\n3. **Red-Pen Mistake Audit:** Open your reference material. Circle anything you missed or misremembered in red ink.\n4. **Bug Log Transfer:** Log your specific points of friction into the *Mistake Bank & Bug Log* for spaced repetition.\n\n*Remember: High retention only occurs when you struggle to pull knowledge out of your brain, never by re-reading!*`,
        action: {
          type: 'switch_view',
          view: 'recall',
          label: '📝 Switch to Active Recall Studio'
        }
      };
    }

    // 5. SPACED REPETITION / LEITNER BOX CHECK
    if (query.includes('spaced') || query.includes('leitner') || query.includes('flashcard') || query.includes('anki') || query.includes('box')) {
      const b1 = leitner.box1 ? leitner.box1.length : 0;
      const b2 = leitner.box2 ? leitner.box2.length : 0;
      const b3 = leitner.box3 ? leitner.box3.length : 0;

      let msg = `🗂️ **Leitner Spaced Repetition Matrix:**\n\n- **Box 1 (Daily Review):** **${b1}** items ${b1 > 3 ? '[URGENT]' : ''}\n- **Box 2 (Every 3 Days):** **${b2}** items\n- **Box 3 (Weekly Mastery):** **${b3}** items\n\n`;

      if (leitner.box1 && leitner.box1.length > 0) {
        msg += `**Top concepts currently pending in Box 1:**\n`;
        leitner.box1.slice(0, 3).forEach((item) => {
          msg += `- <code>${item}</code>\n`;
        });
        msg += `\nRun through these items with rapid 3-second retrieval. Advance cards that you recall flawlessly to Box 2!`;
      } else {
        msg += `✨ Box 1 is clear! Excellent job keeping your short-term review queue empty.`;
      }

      return {
        text: msg,
        action: {
          type: 'switch_view',
          view: 'spaced',
          label: '🗂️ Go to Spaced Repetition Board'
        }
      };
    }

    // 6. PROCRASTINATION / 5-MINUTE RULE
    if (query.includes('procrastinat') || query.includes('motivation') || query.includes('lazy') || query.includes('5-min') || query.includes('hard') || query.includes('tired') || query.includes('stuck')) {
      return {
        text: `🛡️ **The 5-Minute Momentum Protocol:**\n\nWhen cognitive friction is paralyzing you on a Level 1 subject:\n\n1. **Drop Expectations:** Tell yourself: *"I am not going to finish the entire assignment right now. I will only work for 5 minutes."*\n2. **Single Micro-Action:** Open just one problem or retrieve 3 flashcards.\n3. **Start the Clock:** Neurobiology shows that 80% of task paralysis dissolves once the basal ganglia senses initial forward motion.\n\nLet's test it right now with a 5-Minute Recall Blurt:`,
        action: {
          type: 'start_quick_blurt',
          label: '⚡ Launch 5-Minute Blurt Timer'
        }
      };
    }

    // 7. STUDY ADVICE & METHODOLOGY
    if (query.includes('advice') || query.includes('tip') || query.includes('how to study') || query.includes('strategy') || query.includes('pomodoro') || query.includes('interleav')) {
      return {
        text: `💡 **Academic Coach Methodology Guidelines:**\n\n- **The 50/30/20 Rule:** Allocate 50% of your time to Level 1–2 high-friction courses, 30% to Level 3 moderate courses, and 20% to Level 4 maintenance.\n- **Interleaved Practice:** Avoid studying one subject for 6 hours straight. Alternate between Calculus and DSA to force your brain to discriminate problem patterns.\n- **Pomodoro Cycles:** Use 25m/5m for intense mathematical derivation and 50m/10m for deep algorithmic programming.\n- **Closed-Book Rule:** Never highlight passively. Test yourself before, during, and after every study session.`
      };
    }

    // 8. SUBJECT-SPECIFIC TEACHER ANSWERS
    if (query.includes('all subject') || query.includes('subjects') || query.includes('what can you teach')) {
      return {
        text: `📚 **The Five Subjects — Basic Meaning:**\n\n- **User Interface / Design:** how an app or website looks, feels, and guides users. *Example:* designing a clear login screen.\n- **Artificial Intelligence:** how computers learn, reason, recognize patterns, and make decisions. *Example:* a system that detects spam.\n- **RDBMS:** how related information is stored in tables and queried with SQL. *Example:* connecting students to their courses.\n- **Python:** a readable programming language for building software, automation, data work, and AI. *Example:* writing a loop to process a list.\n- **Computer Network:** how devices communicate and share information. *Example:* a browser requesting a webpage from a server.\n\nStart with the subject that interests you, then ask me for a beginner lesson, diagram, example, or short quiz.`
      };
    }

    if (query.includes('python') || query.includes('pip') || query.includes('list comprehension') || query.includes('def ') || query.includes('django')) {
      return {
        text: `🐍 **Python Teacher — Core Lesson:**\n\nPython programs are built from variables, conditions, loops, functions, and reusable objects. A good learning pattern is:\n\n1. Write the smallest example.\n2. Predict the output before running it.\n3. Test one edge case.\n4. Explain why the result happened.\n\n**Example:**\n\`\`\`python\nnumbers = [1, 2, 3, 4]\nevens = [n for n in numbers if n % 2 == 0]\nprint(evens)  # [2, 4]\n\`\`\`\n\nSend me your Python code or error message and I’ll explain the bug and show a corrected version.`
      };
    }

    if (query.includes('rdbms') || query.includes('database') || query.includes('sql') || query.includes('primary key') || query.includes('foreign key') || query.includes('normalization') || query.includes('join')) {
      return {
        text: `🗄️ **RDBMS Teacher — Core Lesson:**\n\nAn RDBMS stores related data in tables. A **primary key** uniquely identifies each row; a **foreign key** links one table to another.\n\n**Example:**\n\`\`\`sql\nSELECT students.name, courses.title\nFROM students\nJOIN courses ON students.course_id = courses.id;\n\`\`\`\n\nThis join combines matching rows from both tables. Ask me about normalization, SQL queries, joins, indexes, transactions, or schema design and I’ll explain it with a practical example.`
      };
    }

    if (query.includes('artificial intelligence') || query.includes('machine learning') || query.includes('neural network') || query.includes('supervised') || query.includes('unsupervised') || query.includes('ai ') || query === 'ai') {
      return {
        text: `🤖 **Artificial Intelligence Teacher — Core Lesson:**\n\n- **Supervised learning** learns from labeled examples, such as emails marked spam or not spam.\n- **Unsupervised learning** finds patterns in unlabeled data, such as customer groups.\n- **Reinforcement learning** learns actions through rewards and penalties.\n\nTo evaluate an AI model, separate training and test data, then check metrics such as accuracy, precision, recall, or mean squared error. Ask for any AI concept and I’ll teach it from intuition to technical detail.`
      };
    }

    if (query.includes('user interface') || query.includes('ui ') || query.includes('ux') || query.includes('design') || query.includes('usability') || query.includes('wireframe') || query.includes('typography') || query.includes('accessibility')) {
      return {
        text: `🎨 **UI / Design Teacher — Core Lesson:**\n\nGood interface design makes the next action obvious. Start with:\n\n1. **Hierarchy:** make the most important information visually strongest.\n2. **Consistency:** reuse spacing, colors, controls, and language.\n3. **Feedback:** show what happened after every user action.\n4. **Accessibility:** support keyboard navigation, readable contrast, labels, and responsive layouts.\n\nAsk me to critique a screen, choose colors or typography, plan a wireframe, or improve a user flow.`
      };
    }

    if (query.includes('computer network') || query.includes('network') || query.includes('osi') || query.includes('tcp') || query.includes('ip address') || query.includes('dns') || query.includes('http') || query.includes('routing')) {
      return {
        text: `🌐 **Computer Network Teacher — Core Lesson:**\n\nThe **OSI model** divides communication into seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. In everyday web communication, DNS finds an IP address, TCP provides reliable delivery, and HTTP carries web requests and responses.\n\nAsk me about subnetting, OSI vs TCP/IP, routing, DNS, HTTP, ports, or network security and I’ll walk through it step by step.`
      };
    }

    if (query.includes('calc') || query.includes('math') || query.includes('152') || query.includes('integral') || query.includes('series') || query.includes('taylor') || query.includes('ratio')) {
      return {
        text: `📘 **Teacher note:** Calculus is no longer one of your active subjects. I can still explain the concept, or you can ask about UI Design, Artificial Intelligence, RDBMS, Python, or Computer Network.`
      };
    }

    // 9. GENERAL TEACHER FALLBACK
    return {
      text: `👨‍🏫 **AI Teacher:** I’m ready to help with **${courses.length} subjects**: User Interface / Design, Fundamentals of Artificial Intelligence, RDBMS, Python, and Computer Network.\n\nYour question was: *"${rawQuery}"*\n\nAsk me to **explain a concept, solve a problem, review code, create examples, compare topics, or quiz you**. For the best answer, mention the subject and your level (beginner, intermediate, or exam revision).`
    };
  }

  // ==========================================
  // APP ACTION EXECUTOR
  // ==========================================
  executeAppAction(action) {
    if (!action || !this.app) return;

    if (action.type === 'start_block_timer' && action.block) {
      const b = action.block;
      this.app.timerTargetTask.textContent = `${b.blockTag}: ${b.subject} — ${b.objective}`;
      if (b.timeType && b.timeType.includes('50m')) {
        this.app.setTimerMode('deep');
      } else {
        this.app.setTimerMode('standard');
      }
      this.app.startTimer();
      this.closeChat();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'switch_view' && action.view) {
      this.app.switchView(action.view);
      this.closeChat();
    } else if (action.type === 'switch_day' && action.day) {
      this.app.switchDay(action.day);
      this.closeChat();
    } else if (action.type === 'start_quick_blurt') {
      this.app.setTimerMode('recall');
      this.app.startTimer();
      this.closeChat();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// ==========================================
// 7. CUSTOM FUTURISTIC INTERACTIVE CURSOR
// ==========================================
class InteractiveCursor {
  static init() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      dot.classList.remove('cursor-hidden');
      ring.classList.remove('cursor-hidden');
    });

    window.addEventListener('mousedown', () => {
      ring.classList.add('cursor-active');
      dot.classList.add('cursor-active');
    });

    window.addEventListener('mouseup', () => {
      ring.classList.remove('cursor-active');
      dot.classList.remove('cursor-active');
    });

    document.documentElement.addEventListener('mouseleave', () => {
      dot.classList.add('cursor-hidden');
      ring.classList.add('cursor-hidden');
    });

    document.documentElement.addEventListener('mouseenter', () => {
      dot.classList.remove('cursor-hidden');
      ring.classList.remove('cursor-hidden');
    });

    // Hover detection over interactive targets
    const interactiveSelector = 'button, a, input, textarea, select, .custom-checkbox, .day-tab, .mode-pill, .card-item, .confidence-slider, .ai-quick-chip, .ai-chat-launcher, .stat-card, .sound-toggle-pill, .btn-icon-action, .modal-close';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      }
    });

    // Smooth LERP animation loop for the trailing ring
    function render() {
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      ring.style.left = `${ringX.toFixed(2)}px`;
      ring.style.top = `${ringY.toFixed(2)}px`;

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}

// ==========================================
// 8. 3D CARD TILT & TACTILE RIPPLE INTERACTIONS
// ==========================================
class Interactive3D {
  static init() {
    // 1. 3D Spatial Tilt on Cards
    const tiltCards = document.querySelectorAll('.glass-panel, .stat-card, .methodology-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = ((y - centerY) / centerY) * -4.5;
        const tiltY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });

    // 2. Click Ripple Wave Generation
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, .btn-primary, .btn-secondary, .btn-ghost, .day-tab, .mode-pill, .ai-quick-chip, .sound-toggle-pill');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-wave');

      const existingRipple = btn.querySelector('.ripple-wave');
      if (existingRipple) existingRipple.remove();

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 550);
    });
  }
}

// ==========================================
// 9. DYNAMIC THEME MANAGER
// ==========================================
class ThemeManager {
  static init() {
    this.selector = document.getElementById('theme-selector');
    const savedTheme = localStorage.getItem('study_theme') || 'cyberpunk';
    this.applyTheme(savedTheme, false);

    if (this.selector) {
      this.selector.value = savedTheme;
      this.selector.addEventListener('change', (e) => {
        this.applyTheme(e.target.value, true);
      });
    }
  }

  static applyTheme(themeName, playAudio = true) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('study_theme', themeName);
    if (this.selector && this.selector.value !== themeName) {
      this.selector.value = themeName;
    }
    if (playAudio && typeof AudioFX !== 'undefined') {
      AudioFX.playPop();
    }
  }
}

// ==========================================
// 10. USER AUTHENTICATION & SESSION TRACKER
// ==========================================
class UserSessionManager {
  constructor() {
    this.sessionStart = Date.now();
    this.sessionSeconds = 0;
    this.isTabActive = true;
    this.timerInterval = null;

    // Load or initialize user profile
    this.currentUser = this.loadCurrentUser();
    this.lifetimeSeconds = parseInt(localStorage.getItem('study_lifetime_seconds') || '3600', 10);
    this.todayDateStr = new Date().toISOString().split('T')[0];
    this.todaySeconds = parseInt(localStorage.getItem(`study_today_${this.todayDateStr}`) || '1800', 10);
    this.sessionLogs = this.loadSessionLogs();

    this.initDOM();
    this.bindEvents();
    this.updateUserUI();
    this.updateDisplayStats();
    this.renderSessionLogs();
    this.startSessionTimer();
  }

  loadCurrentUser() {
    try {
      const stored = localStorage.getItem('study_current_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.name === 'Guest Scholar') {
          user.name = 'Your Name';
          localStorage.setItem('study_current_user', JSON.stringify(user));
        }
        return user;
      }
    } catch (e) {
      console.warn('Error loading current user:', e);
    }
    return {
      name: 'Your Name',
      email: 'guest@scholar.ai',
      major: 'General Academic Study Plan',
      isGuest: true,
      notes: 'Initial focus on highest friction topics (Calculus & DSA). Notes auto-sync with profile.'
    };
  }

  saveCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem('study_current_user', JSON.stringify(user));
    this.updateUserUI();
  }

  loadSessionLogs() {
    try {
      const stored = localStorage.getItem('study_session_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error loading session logs:', e);
    }
    return [
      {
        id: 'log_1',
        date: new Date(Date.now() - 86400000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        time: '7:45 PM',
        durationStr: '45m 00s',
        subject: 'Calculus II Proofs'
      },
      {
        id: 'log_2',
        date: new Date(Date.now() - 172800000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        time: '6:15 PM',
        durationStr: '50m 00s',
        subject: 'Dynamic Programming Practice'
      }
    ];
  }

  saveSessionLogs() {
    localStorage.setItem('study_session_history', JSON.stringify(this.sessionLogs.slice(0, 30)));
    this.renderSessionLogs();
  }

  initDOM() {
    // Header elements
    this.userNameDisplay = document.getElementById('user-name-display');
    this.sessionTimerBadge = document.getElementById('session-timer-badge');
    this.userProfileBtn = document.getElementById('user-profile-btn');
    this.sessionStatCard = document.getElementById('session-stat-card');
    this.lifetimeStudyText = document.getElementById('lifetime-study-time');
    this.todayStudyText = document.getElementById('today-study-time');

    // Auth Modal elements
    this.authModal = document.getElementById('auth-modal');
    this.authCloseBtn = document.getElementById('auth-modal-close-btn');
    this.authForm = document.getElementById('auth-form');
    this.tabLogin = document.getElementById('tab-login');
    this.tabSignup = document.getElementById('tab-signup');
    this.groupName = document.getElementById('group-signup-name');
    this.groupMajor = document.getElementById('group-signup-major');
    this.authSubmitBtn = document.getElementById('auth-submit-btn');
    this.authGuestBtn = document.getElementById('auth-guest-btn');
    this.authEmailInput = document.getElementById('auth-email');
    this.authNameInput = document.getElementById('auth-name');
    this.authMajorInput = document.getElementById('auth-major');
    this.authPasswordInput = document.getElementById('auth-password');
    this.authMode = 'login';

    // Session Modal elements
    this.sessionModal = document.getElementById('session-modal');
    this.sessionCloseBtn = document.getElementById('session-modal-close-btn');
    this.sessionDoneBtn = document.getElementById('session-modal-done-btn');
    this.sessionUsername = document.getElementById('session-modal-username');
    this.sessionMajor = document.getElementById('session-modal-major');
    this.userDisplayNameInput = document.getElementById('user-display-name-input');
    this.metricCurrent = document.getElementById('metric-current-session');
    this.metricToday = document.getElementById('metric-today-session');
    this.metricLifetime = document.getElementById('metric-lifetime-session');
    this.userNotesTextarea = document.getElementById('user-study-notes');
    this.notesSaveIndicator = document.getElementById('notes-save-indicator');
    this.sessionLogList = document.getElementById('session-log-list');
    this.clearLogsBtn = document.getElementById('clear-session-history-btn');
    this.logoutBtn = document.getElementById('btn-user-logout');
    this.exportJsonBtn = document.getElementById('export-json-btn');
    this.exportCsvBtn = document.getElementById('export-csv-btn');
    this.importDataBtn = document.getElementById('import-data-btn');
    this.importDataInput = document.getElementById('import-data-input');
  }

  bindEvents() {
    // Visibility detection to pause active tracker when tab is hidden
    document.addEventListener('visibilitychange', () => {
      this.isTabActive = !document.hidden;
    });

    // Header profile button click -> opens Session Dashboard
    if (this.userProfileBtn) {
      this.userProfileBtn.addEventListener('click', () => this.openSessionModal());
    }
    if (this.sessionStatCard) {
      this.sessionStatCard.addEventListener('click', () => this.openSessionModal());
    }

    // Session Modal Close
    if (this.sessionCloseBtn) {
      this.sessionCloseBtn.addEventListener('click', () => this.closeSessionModal());
    }
    if (this.sessionDoneBtn) {
      this.sessionDoneBtn.addEventListener('click', () => this.closeSessionModal());
    }

    if (this.exportJsonBtn) {
      this.exportJsonBtn.addEventListener('click', () => window.studyApp.exportData('json'));
    }
    if (this.exportCsvBtn) {
      this.exportCsvBtn.addEventListener('click', () => window.studyApp.exportData('csv'));
    }
    if (this.importDataBtn && this.importDataInput) {
      this.importDataBtn.addEventListener('click', () => this.importDataInput.click());
      this.importDataInput.addEventListener('change', (event) => {
        const [file] = event.target.files;
        if (file) window.studyApp.importData(file);
        event.target.value = '';
      });
    }

    // Notes autosave with debounce
    if (this.userNotesTextarea) {
      this.userNotesTextarea.value = this.currentUser.notes || '';
      let debounceTimeout = null;
      this.userNotesTextarea.addEventListener('input', () => {
        if (this.notesSaveIndicator) this.notesSaveIndicator.textContent = 'Saving...';
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          this.currentUser.notes = this.userNotesTextarea.value;
          this.saveCurrentUser(this.currentUser);
          if (this.notesSaveIndicator) this.notesSaveIndicator.textContent = 'Auto-saved to profile ✓';
        }, 600);
      });
    }

    if (this.userDisplayNameInput) {
      this.userDisplayNameInput.value = this.currentUser.name || '';
      this.userDisplayNameInput.addEventListener('input', () => {
        const name = this.userDisplayNameInput.value.trim();
        this.currentUser.name = name || 'Your Name';
        this.saveCurrentUser(this.currentUser);
      });
    }

    // Clear logs
    if (this.clearLogsBtn) {
      this.clearLogsBtn.addEventListener('click', () => {
        if (confirm('Clear session history timeline?')) {
          this.sessionLogs = [];
          this.saveSessionLogs();
        }
      });
    }

    // Log Out button
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => {
        this.closeSessionModal();
        this.openAuthModal();
      });
    }

    // Auth Modal controls
    if (this.authCloseBtn) {
      this.authCloseBtn.addEventListener('click', () => this.closeAuthModal());
    }
    if (this.tabLogin) {
      this.tabLogin.addEventListener('click', () => this.setAuthMode('login'));
    }
    if (this.tabSignup) {
      this.tabSignup.addEventListener('click', () => this.setAuthMode('signup'));
    }
    if (this.authGuestBtn) {
      this.authGuestBtn.addEventListener('click', () => {
        this.saveCurrentUser({
          name: 'Your Name',
          email: 'guest@scholar.ai',
          major: 'General Academic Study Plan',
          isGuest: true,
          notes: ''
        });
        this.closeAuthModal();
      });
    }

    // Auth Form Submit
    if (this.authForm) {
      this.authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.authEmailInput.value.trim();
        const name = this.authNameInput.value.trim() || email.split('@')[0];
        const major = this.authMajorInput.value.trim() || 'Academic Study Plan';

        if (this.authMode === 'signup') {
          const newUser = {
            id: 'u_' + Date.now(),
            name: name,
            email: email,
            major: major,
            isGuest: false,
            notes: ''
          };
          this.saveCurrentUser(newUser);
          if (typeof AudioFX !== 'undefined') AudioFX.playSuccess();
          alert(`🎉 Welcome to your Study Engine, ${name}! Your personal academic telemetry is now tracking.`);
        } else {
          // Login
          const existingUser = {
            id: 'u_' + email.replace(/[^a-zA-Z0-9]/g, ''),
            name: name || email.split('@')[0],
            email: email,
            major: major,
            isGuest: false,
            notes: this.currentUser.notes || ''
          };
          this.saveCurrentUser(existingUser);
          if (typeof AudioFX !== 'undefined') AudioFX.playSuccess();
        }

        this.authForm.reset();
        this.closeAuthModal();
      });
    }
  }

  setAuthMode(mode) {
    this.authMode = mode;
    if (mode === 'signup') {
      this.tabSignup.classList.add('active');
      this.tabLogin.classList.remove('active');
      this.groupName.style.display = 'flex';
      this.groupMajor.style.display = 'flex';
      this.authSubmitBtn.textContent = 'Create Account';
    } else {
      this.tabLogin.classList.add('active');
      this.tabSignup.classList.remove('active');
      this.groupName.style.display = 'none';
      this.groupMajor.style.display = 'none';
      this.authSubmitBtn.textContent = 'Sign In';
    }
    if (typeof AudioFX !== 'undefined') AudioFX.playPop();
  }

  openAuthModal() {
    if (this.authModal) this.authModal.classList.remove('hidden');
  }

  closeAuthModal() {
    if (this.authModal) this.authModal.classList.add('hidden');
  }

  openSessionModal() {
    this.updateModalMetrics();
    if (this.sessionModal) this.sessionModal.classList.remove('hidden');
  }

  closeSessionModal() {
    if (this.sessionModal) this.sessionModal.classList.add('hidden');
  }

  updateUserUI() {
    if (this.userNameDisplay) {
      this.userNameDisplay.textContent = this.currentUser.name || 'Your Name';
    }
    if (this.sessionUsername) {
      this.sessionUsername.textContent = this.currentUser.name || 'Your Name';
    }
    if (this.sessionMajor) {
      this.sessionMajor.textContent = this.currentUser.major || 'General Academic Focus';
    }
    if (this.userNotesTextarea) {
      this.userNotesTextarea.value = this.currentUser.notes || '';
    }
    if (this.userDisplayNameInput) {
      this.userDisplayNameInput.value = this.currentUser.name || '';
    }
  }

  startSessionTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isTabActive) {
        this.sessionSeconds++;
        this.todaySeconds++;
        this.lifetimeSeconds++;

        // Format active session
        const formatted = this.formatTimeHMS(this.sessionSeconds);
        if (this.sessionTimerBadge) {
          this.sessionTimerBadge.textContent = formatted;
        }
        if (this.metricCurrent) {
          this.metricCurrent.textContent = formatted;
        }

        // Periodic persistence every 10 seconds
        if (this.sessionSeconds % 10 === 0) {
          localStorage.setItem('study_lifetime_seconds', this.lifetimeSeconds.toString());
          localStorage.setItem(`study_today_${this.todayDateStr}`, this.todaySeconds.toString());
          this.updateDisplayStats();
        }

        // Auto-log session chunk every 30 minutes
        if (this.sessionSeconds > 0 && this.sessionSeconds % 1800 === 0) {
          this.recordSessionChunk();
        }
      }
    }, 1000);
  }

  recordSessionChunk() {
    const newLog = {
      id: 'log_' + Date.now(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationStr: this.formatTimeHM(this.sessionSeconds),
      subject: 'Active Study Sprint'
    };
    this.sessionLogs.unshift(newLog);
    this.saveSessionLogs();
  }

  formatTimeHMS(totalSecs) {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  formatTimeHM(totalSecs) {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  updateDisplayStats() {
    if (this.lifetimeStudyText) {
      this.lifetimeStudyText.textContent = this.formatTimeHM(this.lifetimeSeconds);
    }
    if (this.todayStudyText) {
      this.todayStudyText.textContent = `Today: ${this.formatTimeHM(this.todaySeconds)} active`;
    }
  }

  updateModalMetrics() {
    if (this.metricCurrent) {
      this.metricCurrent.textContent = this.formatTimeHMS(this.sessionSeconds);
    }
    if (this.metricToday) {
      this.metricToday.textContent = this.formatTimeHM(this.todaySeconds);
    }
    if (this.metricLifetime) {
      this.metricLifetime.textContent = this.formatTimeHM(this.lifetimeSeconds);
    }
  }

  renderSessionLogs() {
    if (!this.sessionLogList) return;
    this.sessionLogList.innerHTML = '';
    if (this.sessionLogs.length === 0) {
      this.sessionLogList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 12px; font-size: 0.8rem;">No previous sessions logged yet today.</div>`;
      return;
    }

    this.sessionLogs.forEach(log => {
      const item = document.createElement('div');
      item.className = 'session-log-item';
      item.innerHTML = `
        <div class="log-meta-group">
          <span class="log-date">${log.subject || 'Study Session'}</span>
          <span class="log-time">${log.date} at ${log.time}</span>
        </div>
        <span class="log-duration-badge">${log.durationStr}</span>
      `;
      this.sessionLogList.appendChild(item);
    });
  }
}

// ==========================================
// 11. APPLICATION BOOTSTRAPPER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  AudioFX.init();
  window.studyUser = new UserSessionManager();
  window.studyApp = new StudyEngineApp();
  window.studyApp.aiChat = new AcademicAIChat(window.studyApp);
  InteractiveCursor.init();
  Interactive3D.init();
});
