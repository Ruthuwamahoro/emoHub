import { DIFFICULTY_LEVEL, EMOTION_CATEGORY, QUESTION_TYPE, RESOURCE_TYPE } from "@/constants/resources";

export interface LearningResource {
    title: string;
    description: string;
    coverImage?: string;
    resourceType: "video" | "audio" | "article" | "image";
    content: string;
    url?: string;
    thumbnailUrl?: string;
    duration?: number;
    category: 
      | "self-regulation"
      | "self-awareness" 
      | "motivation"
      | "empathy"
      | "social-skills"
      | "relationship-management"
      | "stress-management";
    tags?: string[];
    hasQuiz?: boolean;
    isSaved: boolean;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  }
  export interface SingleResource {
    id: string;
    userId: string;
    title: string;
    description: string;
    coverImage?: string;
    resourceType: "video" | "article";
    content: string;
    url?: string;
    thumbnailUrl?: string;
    duration?: number;
    category: 
      | "self-regulation"
      | "self-awareness" 
      | "motivation"
      | "empathy"
      | "social-skills"
      | "relationship-management"
      | "stress-management";
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    isSaved: boolean;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  }



  export interface QuizQuestion {
    id: string;
    questionText: string; 
    questionType: 'multiple-choice' | 'true-false' | 'short-answer';
    points: number; 
    explanation?: string;
    options?: {
      optionText: string;
      isCorrect: boolean;
      orderIndex?: number; 
    }[];
    correctAnswer?: string | number; 
  }



export interface CreateResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}