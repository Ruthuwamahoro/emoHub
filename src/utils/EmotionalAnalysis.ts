interface AnalysisResult {
  overallStatus: "good" | "moderate" | "concerning";
  insights: string[];
  suggestions: string[];
  followUpNeeded: boolean;
}

export function analyzeMentalHealthData(data: {
  moodRating: number;
  stressLevel: number;
  sleepQuality: number;
  moodFactors: {
    energy: number;
    anxiety: number;
    motivation: number;
    socialConnection: {
      connected: boolean;
      feedback?: string;
    };
    activities: {
      exercise?: { done: boolean };
      mindfulness?: { done: boolean };
      nutrition: number;
    };
  };
}): AnalysisResult {
  const insights: string[] = [];
  const suggestions: string[] = [];
  let followUpNeeded = false;

  if (data.moodRating <= 4) {
    insights.push("Your mood seems lower than optimal.");
    suggestions.push(
      "Consider scheduling a consultation with a mental health professional."
    );
    followUpNeeded = true;
  }

  if (data.sleepQuality < 5) {
    insights.push("Your sleep quality could be improved.");
    suggestions.push(
      "Try establishing a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Limit screen time before bed"
    );
  }

  if (!data.moodFactors.activities.exercise?.done) {
    suggestions.push(
      "Regular physical activity can help improve mood",
      "Start with short walks or gentle exercises"
    );
  }

  if (!data.moodFactors.socialConnection.connected) {
    insights.push("Limited social interaction noted.");
    suggestions.push(
      "Try reaching out to friends or family",
      "Consider joining community activities or support groups"
    );
  }

  const overallStatus = determineOverallStatus(data);

  return {
    overallStatus,
    insights,
    suggestions,
    followUpNeeded,
  };
}

function determineOverallStatus(data: any): "good" | "moderate" | "concerning" {
  const scores = {
    mood: data.moodRating,
    stress: 10 - data.stressLevel, 
    sleep: data.sleepQuality,
    energy: data.moodFactors.energy,
    motivation: data.moodFactors.motivation,
  };

  const averageScore =
    Object.values(scores).reduce((a, b) => a + b, 0) /
    Object.values(scores).length;

  if (averageScore >= 7) return "good";
  if (averageScore >= 5) return "moderate";
  return "concerning";
}
