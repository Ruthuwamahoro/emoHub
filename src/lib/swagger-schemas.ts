// lib/schemas/swagger-schemas.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Role name
 *         description:
 *           type: string
 *           maxLength: 100
 *           description: Role description
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         name: "Admin"
 *         description: "System administrator"
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 * 
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - fullName
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *         password:
 *           type: string
 *         fullName:
 *           type: string
 *           maxLength: 100
 *         username:
 *           type: string
 *         role:
 *           type: string
 *           format: uuid
 *         profilePicUrl:
 *           type: string
 *         bio:
 *           type: string
 *         expertise:
 *           type: string
 *         anonymityPreference:
 *           type: string
 *           maxLength: 50
 *         badges:
 *           type: string
 *         location:
 *           type: string
 *         isVerified:
 *           type: boolean
 *           default: false
 *         onboardingCompleted:
 *           type: boolean
 *           default: false
 *         onboardingCompletedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *           default: true
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         email: "user@example.com"
 *         fullName: "John Doe"
 *         username: "johndoe"
 *         isVerified: false
 *         onboardingCompleted: true
 *         isActive: true
 * 
 *     UserOnboardingProfile:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - goals
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         primaryPurpose:
 *           type: string
 *           enum: [emotional_support, professional_guidance, self_improvement, crisis_support, educational_resources]
 *         goals:
 *           type: string
 *         experienceLevel:
 *           type: string
 *           maxLength: 500
 *         preferences:
 *           type: object
 *           additionalProperties: true
 *         completedAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Post:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - contentType
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         groupId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           maxLength: 255
 *         contentType:
 *           type: string
 *           enum: [text, image, video, audio, link]
 *         textContent:
 *           type: string
 *         mediaUrl:
 *           type: string
 *           maxLength: 1024
 *         mediaAlt:
 *           type: string
 *           maxLength: 255
 *         linkUrl:
 *           type: string
 *           maxLength: 1024
 *         linkDescription:
 *           type: string
 *         linkPreviewImage:
 *           type: string
 *           maxLength: 1024
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     MentalHealthTracker:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - moodRating
 *         - stressLevel
 *         - sleepQuality
 *         - moodFactors
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         moodRating:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         stressLevel:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         sleepQuality:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         comments:
 *           type: string
 *         moodFactors:
 *           type: object
 *           properties:
 *             energy:
 *               type: number
 *             anxiety:
 *               type: number
 *             motivation:
 *               type: number
 *             socialConnection:
 *               type: object
 *               properties:
 *                 connected:
 *                   type: boolean
 *                 feedback:
 *                   type: string
 *             activities:
 *               type: object
 *               properties:
 *                 exercise:
 *                   type: object
 *                   properties:
 *                     done:
 *                       type: boolean
 *                     type:
 *                       type: string
 *                 mindfulness:
 *                   type: object
 *                   properties:
 *                     done:
 *                       type: boolean
 *                     technique:
 *                       type: string
 *                 nutrition:
 *                   type: number
 *             stressors:
 *               type: object
 *               properties:
 *                 work:
 *                   type: number
 *                 relationships:
 *                   type: string
 *             copingStrategies:
 *               type: object
 *               properties:
 *                 supportSystem:
 *                   type: object
 *                   properties:
 *                     reachedOut:
 *                       type: boolean
 *                     contact:
 *                       type: string
 *                 selfCare:
 *                   type: array
 *                   items:
 *                     type: string
 *             symptoms:
 *               type: object
 *               properties:
 *                 physical:
 *                   type: array
 *                   items:
 *                     type: string
 *                 emotional:
 *                   type: array
 *                   items:
 *                     type: string
 *         analysisResults:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [good, moderate, concerning]
 *             insights:
 *               type: array
 *               items:
 *                 type: string
 *             suggestions:
 *               type: array
 *               items:
 *                 type: string
 *             followUpNeeded:
 *               type: boolean
 *             analysisDate:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           maxLength: 255
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         time:
 *           type: string
 *           maxLength: 50
 *         location:
 *           type: string
 *         link:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     AIConversation:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - query
 *         - aiResponse
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         query:
 *           type: string
 *         aiResponse:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     Message:
 *       type: object
 *       required:
 *         - id
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         senderId:
 *           type: string
 *           format: uuid
 *         receiverId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         isRead:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     GroupCategory:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           maxLength: 255
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Group:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           maxLength: 255
 *         categoryId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         image:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     GroupMember:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         group_id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         joined_at:
 *           type: string
 *           format: date-time
 * 
 *     Notification:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           maxLength: 255
 *         message:
 *           type: string
 *         isRead:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     Comment:
 *       type: object
 *       required:
 *         - id
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         postId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Challenge:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         group_id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           maxLength: 255
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         total_points:
 *           type: integer
 *           default: 0
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *           default: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     LearningResource:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - userId
 *         - resourceType
 *         - content
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         coverImage:
 *           type: string
 *         userId:
 *           type: string
 *           format: uuid
 *         resourceType:
 *           type: string
 *           enum: [video, audio, text, image]
 *         content:
 *           type: string
 *         url:
 *           type: string
 *         thumbnailUrl:
 *           type: string
 *         duration:
 *           type: integer
 *         category:
 *           type: string
 *           enum: [self-regulation, self-awareness, motivation, empathy, social-skills, relationship-management, stress-management]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         isSaved:
 *           type: boolean
 *           default: false
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     # Request/Response DTOs
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - fullName
 *         - username
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         bio:
 *           type: string
 *         expertise:
 *           type: string
 *         location:
 *           type: string
 *       example:
 *         email: "newuser@example.com"
 *         fullName: "Jane Smith"
 *         username: "janesmith"
 * 
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         username:
 *           type: string
 *         bio:
 *           type: string
 *         expertise:
 *           type: string
 *         location:
 *           type: string
 *         anonymityPreference:
 *           type: string
 *       example:
 *         fullName: "Jane Doe"
 *         bio: "Updated bio"
 * 
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - contentType
 *       properties:
 *         title:
 *           type: string
 *         contentType:
 *           type: string
 *           enum: [text, image, video, audio, link]
 *         textContent:
 *           type: string
 *         mediaUrl:
 *           type: string
 *         linkUrl:
 *           type: string
 *         groupId:
 *           type: string
 *           format: uuid
 *       example:
 *         title: "My Mental Health Journey"
 *         contentType: "text"
 *         textContent: "Sharing my experience..."
 * 
 *     CreateMentalHealthTrackerRequest:
 *       type: object
 *       required:
 *         - moodRating
 *         - stressLevel
 *         - sleepQuality
 *         - moodFactors
 *       properties:
 *         moodRating:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         stressLevel:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         sleepQuality:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         comments:
 *           type: string
 *         moodFactors:
 *           type: object
 *       example:
 *         moodRating: 7
 *         stressLevel: 5
 *         sleepQuality: 8
 *         comments: "Feeling better today"
 * 
 *     CreateGroupRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         categoryId:
 *           type: string
 *           format: uuid
 *         image:
 *           type: string
 *       example:
 *         name: "Anxiety Support Group"
 *         description: "A supportive community for managing anxiety"
 * 
 *     ApiError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *         code:
 *           type: string
 *           description: Error code
 *       example:
 *         error: "Resource not found"
 *         code: "NOT_FOUND"
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         data:
 *           type: object
 *           description: Response data
 *         message:
 *           type: string
 *           description: Response message
 *       example:
 *         success: true
 *         data: {}
 *         message: "Operation completed successfully"
 * 
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             type: object
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 *       example:
 *         success: true
 *         data: []
 *         pagination:
 *           page: 1
 *           limit: 10
 *           total: 100
 *           totalPages: 10
 */

// TypeScript interfaces for type safety
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
  
  // Response DTOs
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