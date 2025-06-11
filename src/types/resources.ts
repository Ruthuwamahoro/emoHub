export interface LearningResource {
    id: string;
    title: string;
    description: string;
    coverImage?: string;
    userId: string;
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
    createdAt: string;
    isSaved: boolean;
    updatedAt: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  }