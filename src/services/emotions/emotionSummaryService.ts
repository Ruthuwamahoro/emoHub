import db from "@/server/db";
import { UserEmotion, UserEmotionSummary } from "@/server/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { calculateEmotionSummary, type EmotionEntry } from "@/utils/emotionSummaryUtils";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface DailySummaryAI {
  analysis: string;
  insights: string[];
  recommendations: string[];
  dailyTips: string[];
  motivationalMessage: string;
  warningFlags: string[];
}

export interface EmotionAnalysisResult {
    id: string;
    emotionalState: string;
    emotionalScore: number;
    colorCode: string;
    totalEntries: number;
    summaryDate: string;
}

async function getAISummaryAnalysis(
  emotions: EmotionEntry[],
  summaryResult: {
    emotionalState: string;
    emotionalScore: number;
    totalEntries: number;
  }
): Promise<DailySummaryAI | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const emotionsList = emotions.map(e => `${e.feelings} (${e.emotionIntensity}/100)`).join(', ');
    
    const prompt = `You are an expert emotional wellness coach. Analyze this user's daily emotional summary and provide insights.

    Daily Summary (Updated):
    - Overall Emotional State: ${summaryResult.emotionalState}
    - Emotional Score: ${summaryResult.emotionalScore}/100
    - Total Check-ins Today: ${summaryResult.totalEntries}
    - Emotions Recorded: ${emotionsList}

    This is a live update of their emotional state throughout the day. Provide a JSON response with:
    {
      "analysis": "brief analysis of their emotional day so far",
      "insights": ["2-3 key insights about their emotional patterns today"],
      "recommendations": ["3-4 actionable recommendations for the rest of the day or tomorrow"],
      "dailyTips": ["2-3 practical tips for emotional wellness"],
      "motivationalMessage": "encouraging message based on their current state",
      "warningFlags": ["any concerning patterns (if applicable)"]
    }

    Keep it concise, empathetic, and actionable. Focus on their current emotional trajectory.`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 600,
        }
      }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        analysis: parsed.analysis || "Daily emotional check-in completed",
        insights: Array.isArray(parsed.insights) ? parsed.insights : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        dailyTips: Array.isArray(parsed.dailyTips) ? parsed.dailyTips : [],
        motivationalMessage: parsed.motivationalMessage || "Keep taking care of your emotional wellbeing! 🌟",
        warningFlags: Array.isArray(parsed.warningFlags) ? parsed.warningFlags : [],
      };
    }
  } catch (error) {
    console.error("AI Summary error:", error);
  }

  return null;
}

function generateFallbackSummary(
  summaryResult: { emotionalState: string; emotionalScore: number; totalEntries: number }
): DailySummaryAI {
  const { emotionalState, emotionalScore, totalEntries } = summaryResult;
  
  let analysis = `You've had a ${emotionalState.toLowerCase()} emotional day so far`;
  let motivationalMessage = "Keep taking care of your emotional wellbeing! 🌟";
  let recommendations = ["Continue tracking your emotions", "Practice self-care"];
  let insights = [`Your emotional state today has been ${emotionalState.toLowerCase()}`];
  
  if (totalEntries === 1) {
    analysis = `First check-in of the day shows you're feeling ${emotionalState.toLowerCase()}`;
    insights = [`You're starting your day with ${emotionalState.toLowerCase()} emotions`];
  } else {
    analysis = `After ${totalEntries} check-ins today, you're in a ${emotionalState.toLowerCase()} state`;
    insights = [`Your ${totalEntries} check-ins today show a ${emotionalState.toLowerCase()} trend`];
  }
  
  if (emotionalState === 'Positive') {
    motivationalMessage = "Your positive energy is wonderful! Keep this momentum going! ✨";
    recommendations = [
      "Maintain this positive energy throughout the day",
      "Share your joy with others to amplify it",
      "Notice what's contributing to your positive mood"
    ];
    insights.push("You're radiating positive energy today");
  } else if (emotionalState === 'Negative') {
    motivationalMessage = "It's okay to have challenging moments. You have the strength to get through this! 💙";
    recommendations = [
      "Be gentle with yourself right now",
      "Take a few deep breaths and ground yourself",
      "Consider what small positive step you can take"
    ];
    insights.push("You're navigating some difficult emotions today");
  } else {
    recommendations = [
      "Stay mindful of your emotional state",
      "Engage in activities that bring you joy",
      "Check in with yourself regularly"
    ];
  }
  
  return {
    analysis,
    insights,
    recommendations,
    dailyTips: ["Take breaks to check in with yourself", "Practice mindfulness throughout the day"],
    motivationalMessage,
    warningFlags: emotionalScore < -50 ? ["Consider reaching out for support if you continue feeling this way"] : [],
  };
}

export async function generateDailySummary(
  userId: string, 
  targetDate: string 
): Promise<boolean> {
  try {
    const existingSummary = await db
      .select()
      .from(UserEmotionSummary)
      .where(
        and(
          eq(UserEmotionSummary.userId, userId),
          eq(UserEmotionSummary.summaryDate, targetDate)
        )
      )
      .limit(1);

    const startOfDay = new Date(`${targetDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${targetDate}T23:59:59.999Z`);

    const dailyEmotions = await db
      .select()
      .from(UserEmotion)
      .where(
        and(
          eq(UserEmotion.userId, userId),
          gte(UserEmotion.createdAt, startOfDay),
          lte(UserEmotion.createdAt, endOfDay)
        )
      )
      .orderBy(desc(UserEmotion.createdAt));

    if (dailyEmotions.length === 0) {
      return false;
    }

    const summaryResult = calculateEmotionSummary(dailyEmotions as EmotionEntry[]);
    
    let aiAnalysis = await getAISummaryAnalysis(dailyEmotions as EmotionEntry[], summaryResult);
    if (!aiAnalysis) {
      aiAnalysis = generateFallbackSummary(summaryResult);
    }

    const summaryData = {
      userId,
      summaryDate: targetDate,
      emotionalState: summaryResult.emotionalState,
      emotionalScore: summaryResult.emotionalScore,
      colorCode: summaryResult.colorCode,
      totalEntries: summaryResult.totalEntries,
      aiAnalysis: aiAnalysis.analysis,
      aiInsights: aiAnalysis.insights,
      aiRecommendations: aiAnalysis.recommendations,
      aiDailyTips: aiAnalysis.dailyTips,
      aiMotivationalMessage: aiAnalysis.motivationalMessage,
      aiWarningFlags: aiAnalysis.warningFlags,
      updatedAt: new Date(),
    };

    if (existingSummary.length > 0) {
      await db
        .update(UserEmotionSummary)
        .set(summaryData)
        .where(
          and(
            eq(UserEmotionSummary.userId, userId),
            eq(UserEmotionSummary.summaryDate, targetDate)
          )
        );
    } else {
      await db.insert(UserEmotionSummary).values(summaryData);
    }

    return true;
  } catch (error) {
    return false;
  }
}
