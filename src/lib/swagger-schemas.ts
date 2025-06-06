
export interface Role {
    id: string;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface User {
    id: string;
    email: string;
    password?: string;
    fullName: string;
    username: string;
    role?: string;
    profilePicUrl?: string;
    bio?: string;
    expertise?: string;
    anonymityPreference?: string;
    badges?: string;
    location?: string;
    isVerified?: boolean;
    onboardingCompleted?: boolean;
    onboardingCompletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
  }
  
  export interface Post {
    id: string;
    userId?: string;
    groupId?: string;
    title: string;
    contentType: 'text' | 'image' | 'video' | 'audio' | 'link';
    textContent?: string;
    mediaUrl?: string;
    mediaAlt?: string;
    linkUrl?: string;
    linkDescription?: string;
    linkPreviewImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface MentalHealthTracker {
    id: string;
    userId?: string;
    moodRating: number;
    stressLevel: number;
    sleepQuality: number;
    comments?: string;
    moodFactors: any;
    analysisResults?: any;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Group {
    id: string;
    name: string;
    categoryId?: string;
    userId?: string;
    image?: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface LearningResource {
    id: string;
    title: string;
    description: string;
    coverImage?: string;
    userId: string;
    resourceType: 'video' | 'audio' | 'text' | 'image';
    content: string;
    url?: string;
    thumbnailUrl?: string;
    duration?: number;
    category: string;
    tags?: string[];
    createdAt?: Date;
    isSaved?: boolean;
    updatedAt?: Date;
  }
  
  export interface CreateUserRequest {
    email: string;
    fullName: string;
    username: string;
    password?: string;
    bio?: string;
    expertise?: string;
    location?: string;
  }
  
  export interface UpdateUserRequest {
    email?: string;
    fullName?: string;
    username?: string;
    bio?: string;
    expertise?: string;
    location?: string;
    anonymityPreference?: string;
  }
  
  export interface CreatePostRequest {
    title: string;
    contentType: 'text' | 'image' | 'video' | 'audio' | 'link';
    textContent?: string;
    mediaUrl?: string;
    linkUrl?: string;
    groupId?: string;
  }
  
  export interface CreateMentalHealthTrackerRequest {
    moodRating: number;
    stressLevel: number;
    sleepQuality: number;
    comments?: string;
    moodFactors: any;
  }
  
  export interface CreateGroupRequest {
    name: string;
    description: string;
    categoryId?: string;
    image?: string;
  }
  
  export interface ApiError {
    error: string;
    code?: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
  }
  
  export interface PaginatedResponse<T = any> {
    success: boolean;
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }