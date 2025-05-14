export const MOOD_QUESTIONS = [
  {
    id: "mood_rating",
    question: "How would you rate your mood today?",
    type: "scale",
    range: [1, 10],
    labels: {
      1: "Very Low",
      5: "Neutral",
      10: "Excellent",
    },
  },
  {
    id: "sleep_quality",
    question: "How well did you sleep last night?",
    type: "scale",
    range: [1, 10],
    labels: {
      1: "Very Poor",
      5: "Average",
      10: "Very Well",
    },
  },
];

export const DAILY_CHECK_IN_QUESTIONS = [
  {
    id: "energy_level",
    question: "How is your energy level today?",
    options: ["Very Low", "Low", "Moderate", "High", "Very High"],
  },
  {
    id: "anxiety_level",
    question: "How anxious do you feel right now?",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
  {
    id: "motivation",
    question: "How motivated do you feel today?",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
  {
    id: "social_connection",
    question: "Have you connected with someone today?",
    type: "boolean",
    followUp: "How did that interaction make you feel?",
  },
];

export const WELLNESS_ACTIVITIES = [
  {
    id: "exercise",
    question: "Did you engage in physical activity today?",
    type: "boolean",
    followUp: "What type of exercise did you do?",
  },
  {
    id: "mindfulness",
    question: "Did you practice any mindfulness or relaxation techniques?",
    type: "boolean",
    followUp: "Which technique did you use?",
  },
  {
    id: "nutrition",
    question: "How healthy were your food choices today?",
    type: "scale",
    range: [1, 5],
  },
];

export const STRESS_FACTORS = [
  {
    id: "work_stress",
    question: "Rate your work/study-related stress level:",
    type: "scale",
    range: [1, 10],
  },
  {
    id: "relationship_stress",
    question: "How are your relationships affecting your mood?",
    options: [
      "Very Negatively",
      "Somewhat Negatively",
      "Neutral",
      "Somewhat Positively",
      "Very Positively",
    ],
  },
];

export const COPING_MECHANISMS = [
  {
    id: "support_system",
    question: "Did you reach out to your support system when needed?",
    type: "boolean",
    followUp: "Who did you talk to?",
  },
  {
    id: "self_care",
    question: "What self-care activities did you engage in today?",
    type: "multiselect",
    options: [
      "Exercise",
      "Meditation",
      "Reading",
      "Creative Activities",
      "Time in Nature",
      "Social Connection",
      "Relaxation",
      "Other",
    ],
  },
];

export const WEEKLY_REFLECTION = [
  {
    id: "week_overview",
    question: "How would you describe your overall mental state this week?",
    type: "text",
  },
  {
    id: "challenges",
    question: "What were your biggest emotional challenges this week?",
    type: "text",
  },
  {
    id: "achievements",
    question: "What are you most proud of this week?",
    type: "text",
  },
  {
    id: "support_needed",
    question: "Do you feel you need additional support?",
    type: "boolean",
    followUp: "What type of support would be most helpful?",
  },
];

export const SYMPTOM_TRACKING = [
  {
    id: "physical_symptoms",
    question: "Have you experienced any physical symptoms of stress?",
    type: "multiselect",
    options: [
      "Headaches",
      "Muscle Tension",
      "Fatigue",
      "Sleep Issues",
      "Change in Appetite",
      "Other",
    ],
  },
  {
    id: "emotional_symptoms",
    question: "Which emotions have been prominent today?",
    type: "multiselect",
    options: [
      "Joy",
      "Sadness",
      "Anxiety",
      "Anger",
      "Fear",
      "Hope",
      "Contentment",
      "Other",
    ],
  },
];
