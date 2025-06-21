import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
const Role = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


const purposeEnum = pgEnum("user_purpose",[
  "emotional_support",
  "professional guidance",
  "self_improvement",
  "crisis_support",
  "educational_resources"
])

const userOnBoardingProfile = pgTable("user_onboarding_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id).notNull(),  
  impression: text("impression"),
  currentEmotions: text("current_emotions").notNull(),
  expressFellings: text("express_feelings").notNull(),
  goals: text('goals').notNull(),
  experienceLevel: varchar("experience_level", { length: 500}),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

const User = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password_hash"),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  username: varchar("username").notNull(),
  role: uuid("role").references(() => Role.id, { onDelete: "cascade" }),
  profilePicUrl: text("profile_pic_url"),
  bio: text("bio"),
  expertise: text("expertise"),
  anonymityPreference: varchar("anonymity_preference", { length: 50 }),
  badges: text("badges"),
  location: text("location"),
  isVerified: boolean("is_Verified").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  onboardingCompletedAt: timestamp("onboarding_completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

const DailyReflections = pgTable("daily_reflections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  reflectionQuestion: text("reflection_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

const DailyReflectionsResponse = pgTable("daily_reflections_response", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  reflectionId: uuid("reflection_id").references(() => DailyReflections.id, { onDelete: "cascade" }),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const UserProfile = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  bio: text("bio"),
  expertise: text("expertise"),
  anonymityPreference: varchar("anonymity_preference", { length: 50 }), 
  badges: text("badges"),
  location: text("location"),
});

export const postContentTypeEnum = pgEnum("post_content_type", [
  "text",
  "image",
  "video",
  "audio",
  "link",
]);

const Post = pgTable("Post", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "set null" }),
  groupId: uuid("group_id").references(() => Group.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  contentType: postContentTypeEnum("content_type").notNull(),
  textContent: text("text_content"),
  mediaUrl: varchar("media_url", { length: 1024 }),
  mediaAlt: varchar("media_alt", { length: 255 }),
  linkUrl: varchar("link_url", { length: 1024 }),
  linkDescription: text("link_description"),
  linkPreviewImage: varchar("link_preview_image", { length: 1024 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



const Event = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 50 }), 
  location: text("location"), 
  link: text("link"), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});








const Message = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id").references(() => User.id, {
    onDelete: "cascade",
  }),
  receiverId: uuid("receiver_id").references(() => User.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});



const GroupCategories = pgTable("GroupCategories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



const Group = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: uuid("categoryId").references(() => GroupCategories.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  image: text("image"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const GroupMember = pgTable("group_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  group_id: uuid("group_id").references(() => Group.id, {
    onDelete: "cascade",
  }),
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  joined_at: timestamp("joined_at").defaultNow(),
});

export const groupRelations = relations(Group, ({ many, one }) => ({
  members: many(GroupMember),
  category: one(GroupCategories, {
    fields: [Group.categoryId],
    references: [GroupCategories.id],
  }),
  creator: one(User, {
    fields: [Group.userId],
    references: [User.id],
  }),
}));

export const groupMemberRelations = relations(GroupMember, ({ one }) => ({
  group: one(Group, {
    fields: [GroupMember.group_id],
    references: [Group.id],
  }),
  user: one(User, {
    fields: [GroupMember.user_id],
    references: [User.id],
  }),
}));

const Notification = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

const Comment = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => Post.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const CommentLikes = pgTable("CommentLikes", {
  id: uuid("id").primaryKey().defaultRandom(),
  comment_id: uuid("comment_id")
    .references(() => Comment.id, { onDelete: "cascade" })
    .notNull(),
  user_id: uuid("user_id")
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const CommentReplies = pgTable("CommentReplies", {
  id: uuid("id").primaryKey().defaultRandom(),
  comment_id: uuid("comment_id")
    .references(() => Comment.id, { onDelete: "cascade" })
    .notNull(),
  user_id: uuid("user_id")
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
  commentReplies: text("commentReplies").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const AppointmentStatus = pgEnum("appointment_status", [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELED",
]);


const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

const Challenges = pgTable("Challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  weekNumber: integer("week_Number"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  theme: varchar("theme", { length: 255 }).notNull(),
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  total_elements: integer("total_elements").default(0),
  completed_elements: integer("completed_elements").default(0),
  completed_percentage: decimal("completion_percentage", { precision: 5, scale: 2}).default("0"),
  is_week_completed: boolean("is_week_completed").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

const ChallengeElements = pgTable("challenge_elements", {
  id: uuid("id").defaultRandom().primaryKey(),
  challenge_id: uuid("challenge_id").references(() => Challenges.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 255}).notNull(),
  description: varchar("description", { length: 255}).notNull(),
  is_completed: boolean("is_completed").default(false),
  completed_at: timestamp("completed_at"),
  completed_by: uuid("completed_by").references(() => User.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const UserProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  total_weeks: integer('total_weeks').default(0),
  completed_weeks: integer('completed_weeks').default(0),
  total_challenges: integer('total_challenges').default(0),
  completed_challenges: integer('completed_challenges').default(0), 
  overall_completion_percentage: varchar('overall_completion_percentage', { length: 10 }).default('0.00'),
  current_streak: integer('current_streak').default(0),
  longest_streak: integer('longest_streak').default(0),
  last_activity_date: timestamp('last_activity_date').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


export const resourceTypeEnum =   pgEnum("resourceType", ["video", "audio", "article", "image"]);



export const emotionCategoryEnum = pgEnum("emotionCategory", [
  "self-regulation",
  "self-awareness",
  "motivation",
  "empathy",
  "social-skills",
  "relationship-management",
  "stress-management"
]);



export const difficultyLevelEnum = pgEnum("difficultyLevelEnum", [
  "beginner",
  "intermediate",
  "advanced"
]);



const learningResources = pgTable('learning_resources', {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  coverImage: text('cover_image'),
  userId: uuid('user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  resourceType: resourceTypeEnum('resourceType').notNull(),
  content: text('content').notNull(),
  url: text('url'),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'),
  category: emotionCategoryEnum('category').notNull(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isPublished: boolean('is_published').default(false),
  difficultyLevel: difficultyLevelEnum('difficulty_level'),
  hasQuiz: boolean('has_quiz').default(false),
  isSaved: boolean('is_saved').default(false),
  publishedAt: timestamp('published_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const userSavedResources = pgTable('user_saved_resources', {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  resourceId: uuid('resource_id').notNull().references(() => learningResources.id, { onDelete: 'cascade' }),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
  notes: text('notes'),
});

const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'true_false', 'short_answer']);
const quizStatusEnum = pgEnum('quiz_status', ['draft', 'published']);
const quizzes = pgTable('quizzes', {
  id: uuid('id').defaultRandom().primaryKey(),
  resourceId: uuid('resource_id').notNull().references(() => learningResources.id, { onDelete: 'cascade' }),
  creatorId: uuid('creator_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  passingScore: integer('passing_score').notNull().default(70),
  maxAttempts: integer('max_attempts'), // Percentage
  status: quizStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

const quizQuestions = pgTable('quiz_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  quizId: uuid('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  questionType: questionTypeEnum('question_type').notNull().default('multiple_choice'),
  points: integer('points').notNull().default(1), // Points for this question
  orderIndex: integer('order_index').notNull(), // Order of questions in quiz
  explanation: text('explanation'), // Optional explanation for the answer
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const questionOptions = pgTable('question_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').notNull().references(() => quizQuestions.id, { onDelete: 'cascade' }),
  optionText: text('option_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
  orderIndex: integer('order_index').notNull(), // Order of options
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  quizId: uuid('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  score: integer('score'), 
  maxScore: integer('max_score'),
  percentage: integer('percentage'), 
  passed: boolean('passed'),
  timeSpent: integer('time_spent'), 
  attemptNumber: integer('attempt_number').notNull(),
});

const quizResponses = pgTable('quiz_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  attemptId: uuid('attempt_id').notNull().references(() => quizAttempts.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => quizQuestions.id, { onDelete: 'cascade' }),
  selectedOptionId: uuid('selected_option_id').references(() => questionOptions.id, { onDelete: 'cascade' }),
  isCorrect: boolean('is_correct').notNull(),
  pointsEarned: integer('points_earned').notNull().default(0),
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
});

const quizzesRelations = {
  resource: {
    fields: [quizzes.resourceId],
    references: [learningResources.id],
  },
  creator: {
    fields: [quizzes.creatorId],
    references: [User.id],
  },
  questions: {
    fields: [quizzes.id],
    references: [quizQuestions.quizId],
    many: true,
  },
  attempts: {
    fields: [quizzes.id],
    references: [quizAttempts.quizId],
    many: true,
  },
};

const quizQuestionsRelations = {
  quiz: {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  },
  options: {
    fields: [quizQuestions.id],
    references: [questionOptions.questionId],
    many: true,
  },
  responses: {
    fields: [quizQuestions.id],
    references: [quizResponses.questionId],
    many: true,
  },
};

const questionOptionsRelations = {
  question: {
    fields: [questionOptions.questionId],
    references: [quizQuestions.id],
  },
  responses: {
    fields: [questionOptions.id],
    references: [quizResponses.selectedOptionId],
    many: true,
  },
};

const quizAttemptsRelations = {
  quiz: {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  },
  user: {
    fields: [quizAttempts.userId],
    references: [User.id],
  },
  responses: {
    fields: [quizAttempts.id],
    references: [quizResponses.attemptId],
    many: true,
  },
};

const quizResponsesRelations = {
  attempt: {
    fields: [quizResponses.attemptId],
    references: [quizAttempts.id],
  },
  question: {
    fields: [quizResponses.questionId],
    references: [quizQuestions.id],
  },
  selectedOption: {
    fields: [quizResponses.selectedOptionId],
    references: [questionOptions.id],
  },
};


const EmotionLevel = pgEnum("emotion_level", ["VERY_LOW", "LOW", "MODERATE", "HIGH", "VERY_HIGH"]);
const UserEmotion = pgTable("user_emotions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  feelings: varchar("feelings", { length: 255 }).notNull(),
  emotionIntensity: integer("emotionIntensity").notNull().default(0),
  activities: text("activities").array().notNull(),
  notes: text("notes"),
  aiAnalysis: varchar("ai_analysis", { length: 1000 }),
  aiInsights: text("ai_insights").array(),
  aiRecommendations: text("ai_recommendations").array(),
  aiDailyTips: text("ai_daily_tips").array(),
  aiMotivationalMessage: text("ai_motivational_message"),
  aiWarningFlags: text("ai_warning_flags").array(),
  aiPositiveAspects: text("ai_positive_aspects").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})


const UserEmotionSummary = pgTable("user_emotion_summaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
  summaryDate: date("summary_date").notNull(), // yyyy-mm-dd
  emotionalState: varchar("emotional_state", { length: 50 }).notNull(), // e.g., Positive, Neutral, Negative
  emotionalScore: integer("emotional_score").notNull(), // range: -100 to +100
  colorCode: varchar("color_code", { length: 20 }).notNull(), // e.g., "green", "yellow", "red"
  totalEntries: integer("total_entries").notNull(), // number of entries for that day
  aiAnalysis: varchar("ai_analysis", { length: 1000 }),
  aiInsights: text("ai_insights").array(),
  aiRecommendations: text("ai_recommendations").array(),
  aiDailyTips: text("ai_daily_tips").array(),
  aiMotivationalMessage: text("ai_motivational_message"),
  aiWarningFlags: text("ai_warning_flags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



const TodoPriorityEnum = pgEnum("todo_priority", ["LOW", "MEDIUM", "HIGH"]);
const TodoStatusEnum = pgEnum("todo_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

const Todo = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: TodoPriorityEnum("priority").default("MEDIUM"),
  status: TodoStatusEnum("status").default("PENDING"),
  dueDate: timestamp("due_date").notNull(),
  reminderSet: boolean("reminder_set").default(false),
  reminderTime: timestamp("reminder_time"),
  category: varchar("category", { length: 100 }),
  tags: text("tags").array(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const todoRelations = relations(Todo, ({ one }) => ({
  user: one(User, {
    fields: [Todo.userId],
    references: [User.id],
  }),
}));

const ActivityTypeEnum = pgEnum("activity_type", [
  "TODO_CREATED",
  "TODO_UPDATED",
  "TODO_COMPLETED",
  "TODO_DELETED",
  "EMOTION_TRACKED",
  "RESOURCE_ACCESSED",
  "GROUP_JOINED",
  "CHALLENGE_STARTED",
  "CHALLENGE_COMPLETED",
]);

const ActivityHistory = pgTable("activity_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  activityType: ActivityTypeEnum("activity_type").notNull(),
  entityId: uuid("entity_id"), 
  entityType: varchar("entity_type", { length: 50 }),
  details: jsonb("details").$type<{
    title?: string;
    description?: string;
    oldStatus?: string;
    newStatus?: string;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
  }>(),

  performedAt: timestamp("performed_at").defaultNow(),
  ip: varchar("ip", { length: 50 }),
  userAgent: text("user_agent"),
});

export const activityHistoryRelations = relations(
  ActivityHistory,
  ({ one }) => ({
    user: one(User, {
      fields: [ActivityHistory.userId],
      references: [User.id],
    }),
  })
);

export {
  User,
  UserProfile,
  Post,
  Event,
  Message,
  Group,
  GroupMember,
  Notification,
  GroupCategories,
  CommentLikes,
  Comment,
  CommentReplies,
  sessions,
  verificationTokens,
  Role,
  Challenges,
  ChallengeElements,
  learningResources,
  Todo,
  questionTypeEnum,
  TodoPriorityEnum,
  TodoStatusEnum,
  quizStatusEnum ,
  ActivityHistory,
  quizResponsesRelations,
  quizAttemptsRelations,
  questionOptionsRelations,
  quizQuestionsRelations,
  quizzesRelations,
  UserEmotion,
  UserEmotionSummary,
  quizResponses,
  quizAttempts,
  quizQuestions,
  questionOptions,
  EmotionLevel,
  quizzes,
  ActivityTypeEnum,
  userOnBoardingProfile,
  purposeEnum,
  DailyReflections,
  DailyReflectionsResponse
};
