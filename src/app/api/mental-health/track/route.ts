import { NextRequest } from "next/server";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import db from "@/server/db";
import { MentalHealthTracker, Notification } from "@/server/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { analyzeMentalHealthData } from "@/utils/mentalHealthAnalysis";

interface MentalHealthData {
  mood_rating: number;
  sleep_quality: number;
  stress_level: number;
  energy_level: number;
  anxiety_level: number;
  motivation: number;
  social_connection: {
    connected: boolean;
    feedback?: string;
  };
  wellness_activities: {
    exercise?: {
      done: boolean;
      type?: string;
    };
    mindfulness?: {
      done: boolean;
      technique?: string;
    };
    nutrition: number;
  };
  stress_factors: {
    work: number;
    relationships: string;
  };
  coping_mechanisms: {
    supportSystem?: {
      reachedOut: boolean;
      contact?: string;
    };
    selfCare: string[];
  };
  symptoms: {
    physical: string[];
    emotional: string[];
  };
  comments?: string;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }

    const data: MentalHealthData = await req.json();

    if (!data.mood_rating || !data.stress_level || !data.sleep_quality) {
      return sendResponse(
        400,
        null,
        "Missing required fields: mood_rating, stress_level, and sleep_quality are required"
      );
    }

    if (
      data.mood_rating < 1 ||
      data.mood_rating > 10 ||
      data.stress_level < 1 ||
      data.stress_level > 10 ||
      data.sleep_quality < 1 ||
      data.sleep_quality > 10
    ) {
      return sendResponse(400, null, "Rating values must be between 1 and 10");
    }

    const analysis = analyzeMentalHealthData({
      moodRating: Number(data.mood_rating),
      stressLevel: Number(data.stress_level),
      sleepQuality: Number(data.sleep_quality),
      moodFactors: {
        energy: Number(data.energy_level) || 0,
        anxiety: Number(data.anxiety_level) || 0,
        motivation: Number(data.motivation) || 0,
        socialConnection: data.social_connection || { connected: false },
        activities: {
          exercise: data.wellness_activities?.exercise || { done: false },
          mindfulness: data.wellness_activities?.mindfulness || { done: false },
          nutrition: Number(data.wellness_activities?.nutrition) || 0,
        },
      },
    });

    const trackerEntry = await db
      .insert(MentalHealthTracker)
      .values({
        userId,
        moodRating: Number(data.mood_rating),
        stressLevel: Number(data.stress_level),
        sleepQuality: Number(data.sleep_quality),
        comments: data.comments || null,
        moodFactors: {
          energy: Number(data.energy_level) || 0,
          anxiety: Number(data.anxiety_level) || 0,
          motivation: Number(data.motivation) || 0,
          socialConnection: data.social_connection || { connected: false },
          activities: data.wellness_activities || {
            exercise: { done: false },
            mindfulness: { done: false },
            nutrition: 0,
          },
          stressors: data.stress_factors || { work: 0, relationships: "" },
          copingStrategies: data.coping_mechanisms || { selfCare: [] },
          symptoms: data.symptoms || { physical: [], emotional: [] },
        },
        analysisResults: {
          status: analysis.overallStatus,
          insights: analysis.insights,
          suggestions: analysis.suggestions,
          followUpNeeded: analysis.followUpNeeded,
          analysisDate: new Date().toISOString(),
        },
      })
      .returning();

    return sendResponse(
      200,
      null,
      "Mental health data recorded and analyzed successfully"
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unexpected error";
    return sendResponse(500, null, err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const baseCondition = eq(MentalHealthTracker.userId, userId);

    const dateConditions =
      startDate && endDate
        ? and(
            baseCondition,
            gte(MentalHealthTracker.createdAt, new Date(startDate)),
            lte(MentalHealthTracker.createdAt, new Date(endDate))
          )
        : baseCondition;

    const entries = await db
      .select()
      .from(MentalHealthTracker)
      .where(dateConditions)
      .orderBy(desc(MentalHealthTracker.createdAt));

    return sendResponse(
      200,
      entries,
      "Mental health data retrieved successfully"
    );
  } catch (error) {
    return sendResponse(500, null, "Failed to retrieve mental health data");
  }
}
