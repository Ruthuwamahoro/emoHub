export const EMOTION_CATEGORIES = {
    'Happy': 'positive',
    'Loved': 'positive',
    'Excited': 'positive',
    'Grateful': 'positive',
    'Proud': 'positive',
    'Confident': 'positive',
    'Peaceful': 'positive',
    'Optimistic': 'positive',
    'Energetic': 'positive',
    'Content': 'positive',
    
    'Sad': 'negative',
    'Angry': 'negative',
    'Annoyed': 'negative',
    'Frustrated': 'negative',
    'Anxious': 'negative',
    'Stressed': 'negative',
    'Lonely': 'negative',
    'Disappointed': 'negative',
    'Overwhelmed': 'negative',
    'Depressed': 'negative',
    
    'Tired': 'neutral',
    'Neutral': 'neutral',
    'Calm': 'neutral',
    'Bored': 'neutral',
    'Confused': 'neutral',
  } as const;
  
  export type EmotionCategory = typeof EMOTION_CATEGORIES[keyof typeof EMOTION_CATEGORIES];
  export type EmotionalState = 'Positive' | 'Neutral' | 'Negative';
  export type ColorCode = 'green' | 'yellow' | 'red';
  
  export interface EmotionEntry {
    feelings: string;
    emotionIntensity: number;
    createdAt: Date;
  }
  
  export interface EmotionSummaryResult {
    emotionalState: EmotionalState;
    emotionalScore: number;
    colorCode: ColorCode;
    totalEntries: number;
  }
  
  export function calculateEmotionSummary(entries: EmotionEntry[]): EmotionSummaryResult {
    if (entries.length === 0) {
      return {
        emotionalState: 'Neutral',
        emotionalScore: 0,
        colorCode: 'yellow',
        totalEntries: 0,
      };
    }
  
    let totalScore = 0;
    
    entries.forEach(entry => {
      const category = EMOTION_CATEGORIES[entry.feelings as keyof typeof EMOTION_CATEGORIES] || 'neutral';
      
      switch (category) {
        case 'positive':
          totalScore += entry.emotionIntensity;
          break;
        case 'negative':
          totalScore -= entry.emotionIntensity;
          break;
        case 'neutral':
          break;
      }
    });
  
    const normalizedScore = Math.round(totalScore / entries.length);
    
    const clampedScore = Math.max(-100, Math.min(100, normalizedScore));
  
    let emotionalState: EmotionalState;
    let colorCode: ColorCode;
  
    if (clampedScore >= 50) {
      emotionalState = 'Positive';
      colorCode = 'green';
    } else if (clampedScore >= 0) {
      emotionalState = 'Neutral';
      colorCode = 'yellow';
    } else {
      emotionalState = 'Negative';
      colorCode = 'red';
    }
  
    return {
      emotionalState,
      emotionalScore: clampedScore,
      colorCode,
      totalEntries: entries.length,
    };
  }
  