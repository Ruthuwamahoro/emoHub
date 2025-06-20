import db from "@/server/db";
import { UserEmotion } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";


// Google Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAHhG6PbKolivMLTM4Sexl3MckLPqJvXbg";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Helper function to ensure arrays are properly formatted
function ensureArray(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(item => String(item));
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.map(item => String(item)) : [String(value)];
        } catch {
            return [String(value)];
        }
    }
    return [String(value)];
}

// Fallback emotion analysis when Gemini API is unavailable
function analyzeEmotionFallback(feelings: string, intensity: number): string {
    const feelingsLower = feelings.toLowerCase();
    
    const emotionKeywords = {
        happy: ['happy', 'joy', 'excited', 'cheerful', 'delighted', 'pleased', 'good', 'great', 'amazing'],
        sad: ['sad', 'depressed', 'down', 'melancholy', 'blue', 'unhappy', 'terrible', 'awful'],
        angry: ['angry', 'mad', 'frustrated', 'irritated', 'furious', 'annoyed', 'hate'],
        anxious: ['anxious', 'worried', 'nervous', 'stressed', 'concerned', 'uneasy', 'scared'],
        calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'fine'],
        energetic: ['energetic', 'pumped', 'motivated', 'active', 'enthusiastic', 'pumped up']
    };
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        if (keywords.some(keyword => feelingsLower.includes(keyword))) {
            const intensityText = intensity > 7 ? 'very ' : intensity > 4 ? 'moderately ' : 'slightly ';
            return `${intensityText}${emotion}`;
        }
    }
    
    return intensity > 6 ? 'intense emotions' : intensity > 3 ? 'moderate emotions' : 'mild emotions';
}

// Get comprehensive AI analysis with recommendations
async function getComprehensiveAnalysis(feelings: string, intensity: number, activities: string[], notes: string): Promise<any> {
    try {
        const prompt = `You are an expert emotional wellness coach and therapist. Analyze the user's emotional state and provide comprehensive insights.

        User's Current State:
        - Feelings: ${feelings}
        - Emotion Intensity (1-10): ${intensity}
        - Activities: ${activities.join(", ") || "none"}
        - Notes: ${notes || "No additional notes"}

        Please provide a detailed JSON response with the following structure:
        {
            "emotion": "primary emotion in 1-2 words",
            "emotionDescription": "brief description of the emotional state",
            "insights": "deeper analysis of what might be causing these feelings",
            "recommendations": [
                "3-5 specific actionable recommendations to improve or maintain emotional wellbeing"
            ],
            "dailyTips": [
                "2-3 practical daily tips for emotional wellness"
            ],
            "motivationalMessage": "an inspiring and encouraging message",
            "warningFlags": [
                "any concerning patterns or red flags (if applicable)"
            ],
            "positiveAspects": [
                "highlight positive elements in their emotional journey"
            ]
        }

        Make your response empathetic, professional, and actionable. Focus on practical advice that can be implemented immediately.`;

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 800,
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API error:", response.status, errorData);
            
            // Fallback to gemini-1.0-pro
            if (response.status === 404 && errorData.error?.message?.includes('not found')) {
                console.log("Trying fallback model: gemini-1.0-pro");
                const fallbackUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`;
                
                const fallbackResponse = await fetch(fallbackUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 800,
                        }
                    }),
                });
                
                if (fallbackResponse.ok) {
                    const fallbackResult = await fallbackResponse.json();
                    if (fallbackResult.candidates?.[0]?.content?.parts?.[0]?.text) {
                        return parseGeminiResponse(fallbackResult.candidates[0].content.parts[0].text);
                    }
                }
            }
            
            return null;
        }

        const result = await response.json();
        
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return parseGeminiResponse(result.candidates[0].content.parts[0].text);
        }
        
        return null;
    } catch (error) {
        console.error("Gemini API error:", error);
        return null;
    }
}

// Parse Gemini response and extract JSON or create structured response
function parseGeminiResponse(text: string): any {
    try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Ensure all array fields are properly formatted
            return {
                ...parsed,
                recommendations: ensureArray(parsed.recommendations),
                dailyTips: ensureArray(parsed.dailyTips),
                warningFlags: parsed.warningFlags ? (typeof parsed.warningFlags === 'string' ? [parsed.warningFlags] : ensureArray(parsed.warningFlags)) : [],
                positiveAspects: parsed.positiveAspects ? (typeof parsed.positiveAspects === 'string' ? [parsed.positiveAspects] : ensureArray(parsed.positiveAspects)) : []
            };
        }
    } catch (error) {
        console.log("Failed to parse JSON, creating structured response from text");
    }
    
    return {
        emotion: "mixed emotions",
        emotionDescription: "Processing your emotional state",
        insights: text.substring(0, 200) + "...",
        recommendations: [
            "Take a moment to breathe deeply and center yourself",
            "Consider journaling about your feelings to gain clarity",
            "Engage in activities that bring you joy and peace"
        ],
        dailyTips: [
            "Practice mindfulness for 5 minutes daily",
            "Connect with someone you care about"
        ],
        motivationalMessage: "Remember that every emotion is valid and temporary. You have the strength to navigate through this. 🌟",
        warningFlags: [],
        positiveAspects: ["You're taking the important step of acknowledging and tracking your emotions."]
    };
}

function generateFallbackAnalysis(feelings: string, intensity: number, activities: string[], notes: string): any {
    const emotion = analyzeEmotionFallback(feelings, intensity);
    
    const recommendations = [];
    const dailyTips = [];
    let motivationalMessage = "";
    const warningFlags = [];
    const positiveAspects = ["You're actively monitoring your emotional wellbeing, which shows great self-awareness and commitment to personal growth."];
    
    if (intensity >= 8) {
        recommendations.push("Consider reaching out to a trusted friend or professional for support");
        warningFlags.push("High emotional intensity detected. Please prioritize self-care and seek support if needed.");
    }
    
    if (emotion.includes('sad') || emotion.includes('depressed')) {
        recommendations.push(
            "Try engaging in gentle physical activity like walking",
            "Practice gratitude by writing down three things you're thankful for",
            "Listen to uplifting music or watch something that makes you smile"
        );
        dailyTips.push("Spend time in nature or sunlight", "Connect with supportive people");
        motivationalMessage = "It's okay to feel sad sometimes. This feeling will pass, and brighter days are ahead. You are stronger than you know. 💙";
    } else if (emotion.includes('anxious') || emotion.includes('stressed')) {
        recommendations.push(
            "Practice deep breathing exercises (4-7-8 technique)",
            "Break down overwhelming tasks into smaller, manageable steps",
            "Try progressive muscle relaxation or meditation"
        );
        dailyTips.push("Limit caffeine intake", "Establish a calming bedtime routine");
        motivationalMessage = "Anxiety is temporary, but your courage is permanent. Take it one breath at a time. 🌸";
    } else if (emotion.includes('angry') || emotion.includes('frustrated')) {
        recommendations.push(
            "Try physical exercise to release tension",
            "Practice counting to 10 before reacting to triggers",
            "Consider what you can control vs. what you cannot"
        );
        dailyTips.push("Use 'I' statements when communicating", "Take breaks when feeling overwhelmed");
        motivationalMessage = "Your anger is valid, but you have the power to channel it constructively. You've got this! 🔥";
    } else if (emotion.includes('happy') || emotion.includes('excited')) {
        recommendations.push(
            "Share your joy with others to amplify it",
            "Document this positive moment in a journal",
            "Use this positive energy to tackle something you've been putting off"
        );
        dailyTips.push("Practice gratitude daily", "Celebrate small wins");
        motivationalMessage = "Your joy is contagious! Keep shining your light and inspiring others. ✨";
        positiveAspects.push("Your positive energy is wonderful and can inspire those around you!");
    } else {
        recommendations.push(
            "Practice mindfulness to stay present",
            "Engage in activities that align with your values",
            "Maintain regular sleep and exercise routines"
        );
        dailyTips.push("Stay hydrated", "Take regular breaks from screens");
        motivationalMessage = "Every day is a new opportunity for growth and self-discovery. You're doing great! 🌟";
    }
    
    return {
        emotion,
        emotionDescription: `You're experiencing ${emotion} with an intensity level of ${intensity}/10`,
        insights: `Your current emotional state appears to be influenced by your activities: ${activities.join(", ") || "none"}. ${notes ? "Additional context: " + notes : ""}`,
        recommendations,
        dailyTips,
        motivationalMessage,
        warningFlags,
        positiveAspects
    };
}

export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, "Unauthorized");
        }
        
        const body = await req.json();
        if (!body.feelings || body.emotionIntensity === undefined) {
            return sendResponse(400, null, "Feelings and Emotion Intensity are required.");
        }
        
        const activities = ensureArray(body.activities);
        
        let analysis = await getComprehensiveAnalysis(
            body.feelings, 
            body.emotionIntensity, 
            activities, 
            body.notes || ""
        );
        
        if (!analysis) {
            analysis = generateFallbackAnalysis(
                body.feelings, 
                body.emotionIntensity, 
                activities, 
                body.notes || ""
            );
        }
        
        const insertData = {
            userId,
            feelings: body.feelings,
            emotionIntensity: body.emotionIntensity,
            activities: activities,
            notes: body.notes || null,
            aiAnalysis: analysis.emotion,
            aiInsights: ensureArray(analysis.insights),
            aiRecommendations: ensureArray(analysis.recommendations),
            aiDailyTips: ensureArray(analysis.dailyTips),
            aiMotivationalMessage: analysis.motivationalMessage,
            aiWarningFlags: ensureArray(analysis.warningFlags),
            aiPositiveAspects: ensureArray(analysis.positiveAspects),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        const result = await db.insert(UserEmotion).values(insertData).returning();
        
        return sendResponse(200, {
            message: "Emotion recorded successfully! 🎉",
            analysis: {
                ...analysis,
                id: result[0]?.id,
                createdAt: insertData.createdAt
            }
        }, "Emotion recorded successfully! 🎉");
        
    } catch (error) {
        console.error("Error in emotion analysis:", error);
        return sendResponse(500, null, error instanceof Error ? error.message : "Internal Server Error");
    }
}




export async function GET (req: NextRequest){
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, "Unauthorized");
        }
        const emotions = await db.select().from(UserEmotion).where(eq(UserEmotion.userId, userId)).orderBy(desc(UserEmotion.createdAt));
        if (emotions.length === 0) {
            return sendResponse(404, null, "No emotions recorded yet.");
        }
        return sendResponse(200, emotions, "Emotions retrieved successfully!");
        
    } catch (error) {
        return sendResponse(500, null, error instanceof Error ? error.message : "Internal Server Error");
    }
}