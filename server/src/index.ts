import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// Help helper for mock responses based on journal analysis
const getMockAnalysis = (text: string, mood: number, exam: string) => {
  const textLower = text.toLowerCase();
  
  // Calculate a base mind stability index
  let msi = mood * 10;
  if (textLower.includes('stress') || textLower.includes('anxious') || textLower.includes('worry')) {
    msi -= 12;
  }
  if (textLower.includes('fail') || textLower.includes('lose') || textLower.includes('scared')) {
    msi -= 15;
  }
  if (textLower.includes('mock') || textLower.includes('test') || textLower.includes('exam')) {
    msi -= 8;
  }
  if (textLower.includes('parent') || textLower.includes('pressure') || textLower.includes('expect')) {
    msi -= 10;
  }
  if (textLower.includes('sleep') || textLower.includes('tired') || textLower.includes('exhausted')) {
    msi -= 10;
  }
  
  // Clamp MSI between 10 and 95
  msi = Math.max(10, Math.min(95, msi));
  
  // Stress Level and Burnout Risk mapping
  let stressLevel = "Low";
  let burnoutRisk = "Low";
  
  if (msi < 40) {
    stressLevel = "Severe";
    burnoutRisk = "High";
  } else if (msi < 65) {
    stressLevel = "High";
    burnoutRisk = "Medium";
  } else if (msi < 80) {
    stressLevel = "Moderate";
    burnoutRisk = "Low";
  }
  
  // Detect Triggers
  const triggers: string[] = [];
  if (textLower.includes('mock') || textLower.includes('test') || textLower.includes('score')) {
    triggers.push("Mock Test Anxiety");
  }
  if (textLower.includes('parent') || textLower.includes('family') || textLower.includes('father') || textLower.includes('mother')) {
    triggers.push("Parental Expectations");
  }
  if (textLower.includes('peer') || textLower.includes('friend') || textLower.includes('rank') || textLower.includes('better')) {
    triggers.push("Peer Comparison");
  }
  if (textLower.includes('fail') || textLower.includes('clear') || textLower.includes('crack')) {
    triggers.push("Fear of Failure");
  }
  if (textLower.includes('time') || textLower.includes('syllabus') || textLower.includes('cover') || textLower.includes('schedule')) {
    triggers.push("Syllabus / Time Pressure");
  }
  if (textLower.includes('sleep') || textLower.includes('insomnia') || textLower.includes('night')) {
    triggers.push("Sleep Deprivation");
  }
  
  // Fallback to defaults if none found
  if (triggers.length === 0) {
    triggers.push("Syllabus / Time Pressure");
    triggers.push("Mock Test Anxiety");
  }
  
  // Patterns
  const patterns: string[] = [];
  if (triggers.includes("Mock Test Anxiety")) {
    patterns.push("Confidence drops significantly after mock exams");
  }
  if (triggers.includes("Sleep Deprivation")) {
    patterns.push("Late-night study cycles negatively affect daily mood");
  }
  if (triggers.includes("Parental Expectations")) {
    patterns.push("Anxiety spikes during family conversations about ranks");
  }
  if (patterns.length === 0) {
    patterns.push(`Stress correlates with upcoming ${exam} preparation milestones`);
  }
  
  // Positive indicators
  const positives: string[] = [];
  if (textLower.includes('study') || textLower.includes('consistent') || textLower.includes('hours')) {
    positives.push("Maintaining high study consistency");
  }
  if (textLower.includes('try') || textLower.includes('keep') || textLower.includes('again')) {
    positives.push("Demonstrating grit and high resilience");
  }
  positives.push("Active self-reflection through journaling");
  positives.push("Seeking tools to manage mental wellness");
  
  // Recommendations
  const recommendations: string[] = [];
  if (exam === 'JEE') {
    recommendations.push("Prioritize conceptual depth over solving too many mock questions consecutively without analysis.");
    recommendations.push("Take a 10-minute break after every 1.5 hours of Physics and Chemistry problem-solving.");
  } else if (exam === 'NEET') {
    recommendations.push("Allocate biology revisions to high-energy mornings to reduce mental pressure.");
    recommendations.push("Practice breathing exercises to reduce speed-related stress during mock tests.");
  } else if (exam === 'UPSC') {
    recommendations.push("Implement strict boundaries between reading general studies and optional subjects to prevent information overload.");
    recommendations.push("Keep current affairs preparation focused; avoid reading duplicate news sources daily.");
  } else {
    recommendations.push(`Structure your weekly study block to include dedicated downtime to prevent ${exam} prep burnout.`);
    recommendations.push("Focus on micro-goals rather than looking at the entire massive syllabus at once.");
  }
  recommendations.push("Engage in a 5-minute wind-down ritual before sleep without screen exposure.");
  
  const exercise = msi < 40 
    ? "5-Minute Box Breathing: Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 5 times."
    : "3-Minute Progressive Muscle Relaxation: Tense shoulders for 5s, then release completely. Notice the physical relief.";

  return {
    mindStabilityIndex: msi,
    stressLevel,
    burnoutRisk,
    hiddenTriggers: triggers,
    emotionalPatterns: patterns,
    positiveIndicators: positives,
    recommendations,
    confidence: 0.95,
    mindfulnessExercise: exercise
  };
};

// 1. Analyze Endpoint
app.post('/api/analyze', async (req: express.Request, res: express.Response) => {
  const { journalText, moodScore, exam } = req.body;

  if (!journalText || !moodScore || !exam) {
    res.status(400).json({ error: "Missing required inputs (journalText, moodScore, or exam)." });
    return;
  }

  const client = getGenAIClient();

  // If no Gemini client is available, run mock fallback
  if (!client) {
    console.log("[MindMirror API] Running in Demo / Simulated Mode due to missing GEMINI_API_KEY.");
    const mock = getMockAnalysis(journalText, Number(moodScore), exam);
    res.json({ ...mock, isSimulated: true });
    return;
  }

  try {
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            mindStabilityIndex: { type: "integer", description: "Score from 1 to 100 indicating stability (higher is more stable and calm)" },
            stressLevel: { type: "string", description: "Current stress level (Low, Moderate, High, Severe)" },
            burnoutRisk: { type: "string", description: "Current burnout risk (Low, Medium, High)" },
            hiddenTriggers: { 
              type: "array", 
              items: { type: "string" }, 
              description: "Detect hidden or underlying triggers of stress (e.g. Peer Comparison, Mock Test Anxiety, Fear of Failure, Parental Expectations, Time Pressure)" 
            },
            emotionalPatterns: { 
              type: "array", 
              items: { type: "string" }, 
              description: "Identify key emotional habits, trends or patterns (e.g., anxiety spikes near exams)" 
            },
            positiveIndicators: { 
              type: "array", 
              items: { type: "string" }, 
              description: "Identify areas showing resilience, strength, commitment, or self-awareness" 
            },
            recommendations: { 
              type: "array", 
              items: { type: "string" }, 
              description: "Actionable, positive mental health advice customized for the selected exam environment" 
            },
            confidence: { type: "number", description: "Confidence score in this analysis between 0.0 and 1.0" },
            mindfulnessExercise: { type: "string", description: "Brief customized relaxation or mental workout exercise" }
          },
          required: [
            "mindStabilityIndex",
            "stressLevel",
            "burnoutRisk",
            "hiddenTriggers",
            "emotionalPatterns",
            "positiveIndicators",
            "recommendations",
            "confidence",
            "mindfulnessExercise"
          ]
        } as any
      }
    });

    const prompt = `
      You are analyzing a daily mental health journal entry from a student preparing for the ${exam} exam.
      The student has rated their mood as ${moodScore} out of 10.
      
      Journal Entry Content:
      "${journalText}"

      Analyze the entry specifically noting:
      - Stressors related to their exam preparation (competitive pressure, time management, mock test scores, peer comparison, etc.)
      - Signs of burnout, exhaustion, and coping issues.
      - Hidden distress triggers.
      - Positive coping skills, resilience factors, and self-awareness indicators.
      
      Provide your response in the requested JSON structure. Keep recommendations actionable and exam-specific.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    res.json({ ...parsedData, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini API Error in /api/analyze:", error);
    // Fallback on error to ensure hackathon application keeps working
    const mock = getMockAnalysis(journalText, Number(moodScore), exam);
    res.json({ ...mock, isSimulated: true, error: error.message });
  }
});

// 2. Chatbot Coach Endpoint
app.post('/api/chat', async (req: express.Request, res: express.Response) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing required chat messages history." });
    return;
  }

  const client = getGenAIClient();

  // If no Gemini client, do mock chat response
  if (!client) {
    const lastMsg = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || "";
    const exam = context?.exam || "competitive exams";
    const msi = context?.mindStabilityIndex || 50;
    const lastMsgLower = lastMsg.toLowerCase().trim();

    let reply = "";

    // 1. Math query handling
    if (lastMsgLower.includes('2+2') || lastMsgLower.includes('2 + 2')) {
      reply = "2 + 2 is 4. Let me know if you need help planning your study schedule, coping with test anxiety, or practicing box breathing!";
    } else if (lastMsgLower.includes('3+3') || lastMsgLower.includes('3 + 3')) {
      reply = "3 + 3 is 6. I'm here to support your mental wellness and exam focus. What's on your mind?";
    }
    // 2. Study pacing
    else if (lastMsgLower.includes('pacing') || lastMsgLower.includes('schedule') || lastMsgLower.includes('tip') || lastMsgLower.includes('time')) {
      reply = `For pacing your studies for the ${exam}:
- Use the **50-10 Pomodoro Method**: Study with intense concentration for 50 minutes, then take a 10-minute deep breathing break.
- Block your schedules: Dedicate high-energy mornings to difficult topics (like Physics/Math for JEE, or complex Polity files for UPSC).
- Build weekly buffers: Don't schedule mock revisions back-to-back. Give yourself room to breathe.`;
    }
    // 3. Peer pressure
    else if (lastMsgLower.includes('peer') || lastMsgLower.includes('pressure') || lastMsgLower.includes('comparison') || lastMsgLower.includes('friend')) {
      reply = `Dealing with peer comparison during ${exam} preparation is a common stress driver:
- Remember: Exams are individual races. Everyone has a different learning speed and strengths.
- Limit talking about mock scores in study groups or forums.
- Focus on your incremental improvement: Try to beat your own past week's performance, not someone else's.`;
    }
    // 4. Mock test / exams
    else if (lastMsgLower.includes('mock') || lastMsgLower.includes('test') || lastMsgLower.includes('score')) {
      reply = `Mock tests are diagnostics, not final ranks. 
- Try tracking *why* you made errors (careless mistake, concept gap, time rush) rather than just looking at the score.
- Take a 2-minute deep breathing breath before starting review. You've got this!`;
    }
    // 5. Burnout / sleep
    else if (lastMsgLower.includes('burnout') || lastMsgLower.includes('tired') || lastMsgLower.includes('exhausted') || lastMsgLower.includes('sleep')) {
      reply = `Your Mind Stability Index of ${msi}% suggests you need recovery time.
- Cognitive stamina is finite. Reclaim at least 7 hours of sleep.
- Take a complete screen-free break (like a 20-minute walk outside) to reset your nervous system.`;
    }
    // 6. Welcome / general greeting
    else if (lastMsgLower.includes('hello') || lastMsgLower.includes('hi') || lastMsgLower.includes('hey')) {
      reply = `Hello! I'm MindMirror, your personal wellness coach. I'm active in ${exam} Companion Mode. How can I support your study routine or mental peace today?`;
    }
    // 7. General Fallback with dynamic mirroring
    else {
      reply = `I hear you. As your MindMirror coach, I want to help you unpack: "${lastMsg}".
In the context of your ${exam} preparation (MSI: ${msi}%), keeping a calm mind is just as important as reading the syllabus. Break your worries into small actions you can control today.`;
    }

    res.json({ reply, isSimulated: true });
    return;
  }

  try {
    const exam = context?.exam || "competitive exams";
    const msi = context?.mindStabilityIndex || 60;
    const stress = context?.stressLevel || "Moderate";
    const triggers = context?.hiddenTriggers ? context.hiddenTriggers.join(', ') : "General stressors";
    const journalText = context?.journalText || "No journal entry provided yet.";

    const systemPrompt = `
      You are MindMirror, an empathetic AI mental wellness coach for students preparing for high-stakes competitive exams like JEE, NEET, UPSC, GATE, CAT, and CUET.
      
      Your student context:
      - Exam: ${exam}
      - Mind Stability Index: ${msi}/100
      - Stress Level: ${stress}
      - Detected stress drivers/triggers: ${triggers}
      - Student's recent journal entry: "${journalText}"
      
      Role and Guidelines:
      - Provide practical, motivating, and comforting support.
      - Adapt your tone based on the specific exam (e.g., JEE/NEET focus on intense speed/mock score pressure; UPSC focus on long-term stamina/loneliness; CAT on logic/accuracy anxiety).
      - Actively suggest concrete study pacing, mental intervals, and micro-exercises (e.g., box breathing, muscle relaxation, focus recovery).
      - Maintain strict safety boundaries. Never diagnose medical conditions or give clinical advice.
      - If severe distress is detected, recommend reaching out to a professional counselor or trusted family member.
      - Keep responses warm, engaging, motivating, and relatively concise (150-250 words maximum).
    `;

    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // Translate client message history to Gemini content format
    // User role is 'user', bot role is 'model' in Gemini API
    const contents = messages.map((m: any) => {
      const role = (m.role === 'bot' || m.sender === 'bot' || m.role === 'model') ? 'model' : 'user';
      return {
        role,
        parts: [{ text: m.content || m.text || "" }]
      };
    });

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    const reply = result.response.text();
    res.json({ reply, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({ error: "Failed to connect to the Gemini coaching engine.", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[MindMirror Backend] Running on http://localhost:${PORT}`);
});
