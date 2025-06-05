import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
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
  primaryPurpose: purposeEnum("primary_purpose"),
  goals: text('goals').notNull(),
  experienceLevel: varchar("experience_level", { length: 500}),
  preferences: json('preferences').$type<Record<string, any>>(),
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

const UserProfile = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  bio: text("bio"),
  expertise: text("expertise"),
  anonymityPreference: varchar("anonymity_preference", { length: 50 }), // e.g., 'Anonymous', 'Public'
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

const MentalHealthTracker = pgTable("mental_health_tracker", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  moodRating: integer("mood_rating").notNull(),
  stressLevel: integer("stress_level").notNull(),
  sleepQuality: integer("sleep_quality").notNull(),
  comments: text("comments"),
  moodFactors: jsonb("mood_factors")
    .$type<{
      energy: number;
      anxiety: number;
      motivation: number;
      socialConnection: {
        connected: boolean;
        feedback?: string;
      };
      activities: {
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
      stressors: {
        work: number;
        relationships: string;
      };
      copingStrategies: {
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
    }>()
    .notNull(),
  analysisResults: jsonb("analysis_results").$type<{
    status: "good" | "moderate" | "concerning";
    insights: string[];
    suggestions: string[];
    followUpNeeded: boolean;
    analysisDate: string;
  }>(),
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

// export const Appointment = pgTable('appointments', {
//   id: uuid('id').primaryKey(),
//   userId: uuid('user_id').references(() => User.id, { onDelete: 'CASCADE' }),
//   specialistId: uuid('specialist_id').references(() => User.id, { onDelete: 'CASCADE' }), // Specialist
//   appointmentTime: timestamp('appointment_time').notNull(),
//   appointmentType: pgEnum('appointment_type', ['Online', 'In-person']),
//   status: pgEnum('status', ['Scheduled', 'Completed', 'Cancelled']),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
// });

const VideoCallStatus = pgEnum("video_call_status", [
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

// export const VideoCall = pgTable('video_calls', {
//   id: uuid('id').primaryKey(),
//   userId: uuid('user_id').references(() => User.id, { onDelete: 'cascade' }), // The user who booked the call
//   specialistId: uuid('specialist_id').references(() => Specialist.id, { onDelete: 'cascade' }), // The specialist conducting the call
//   startTime: timestamp('start_time').notNull(), // The scheduled start time
//   endTime: timestamp('end_time').notNull(), // The end time, if the meeting has ended
//   status: VideoCallStatus('status').default('SCHEDULED'), // Status of the video call
//   roomId: varchar('room_id').notNull(), // The unique ID for the video call room
//   meetingLink: varchar('meeting_link').notNull(), // The link to join the video call (optional, if using external service)
//   notes: varchar('notes', { length: 500 }).notNull(), // Optional notes for the session
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

const AIConversation = pgTable("ai_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  aiResponse: text("ai_response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const Analytics = pgTable("analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 100 }).notNull(), // Action taken (e.g., 'post_created', 'mood_logged')
  data: text("data"), // Any additional data associated with the action
  createdAt: timestamp("created_at").defaultNow(),
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

const HealthTest = pgTable("health_tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  question1: integer("question_1").notNull(),
  question2: integer("question_2").notNull(),
  testDate: timestamp("test_date").defaultNow(),
  // } {
  //   constraints: {
  //       check: [
  //           'mood_rating BETWEEN 1 AND 10',
  //           'stress_level BETWEEN 1 AND 10',
  //           'sleep_quality BETWEEN 1 AND 10'
  //       ]
  //   }
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

// export const Appointment = pgTable('appointments', {
// id: uuid('id').primaryKey(),
// userId: uuid('user_id').references(() => User.id, { onDelete: 'cascade' }),
// specialistId: uuid('specialist_id').references(() => Specialist.id, { onDelete: 'cascade' }),
// dateTime: timestamp('date_time').notNull(),
// status: AppointmentStatus('status').default('PENDING'),
// notes: varchar('notes', { length: 500 }).notNull(),
// createdAt: timestamp('created_at').defaultNow(),
// updatedAt: timestamp('updated_at').defaultNow(),
// });

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
  group_id: uuid("group_id").references(() => Group.id, {
    onDelete: "cascade",
  }),
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: text("image"),
  total_points: integer("total_points").default(0),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  isActive: boolean('is_active').default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

const ChallengeElements = pgTable("challenge_elements", {
  id: uuid("id").defaultRandom().primaryKey(),
  challenge_id: uuid("challenge_id").references(() => Challenges.id, {
    onDelete: "cascade",
  }),
  questions: varchar("questions", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  points: integer("points").default(0),
  order: integer("order").default(0),
  day_number: integer("day_number").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

const ChallengeFeedback = pgTable("challenge_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  challenge_id: uuid("challenge_id").references(() => Challenges.id, {
    onDelete: "cascade",
  }),
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  question_id: uuid("question_id").references(() => ChallengeElements.id, {
    onDelete: "cascade",
  }),
  response: text("response"),
  completed: boolean("completed").default(false),
  points_earned: integer("points_earned").default(0),
  day_number: integer("day_number").notNull(),
  submitted_at: timestamp("submitted_at").defaultNow(),
});

export const resourceTypeEnum =   pgEnum("resourceType", ["video", "audio", "text", "image"]);


export const emotionCategoryEnum = pgEnum("emotionCategory", [
  "self-regulation",
  "self-awareness",
  "motivation",
  "empathy",
  "social-skills",
  "relationship-management",
  "stress-management"
]);



const learningResources = pgTable('learning_resources', {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  coverImage: text('cover_image'),
  userId: uuid('user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  resourceType: resourceTypeEnum('resource_type').notNull(),
  content: text('content').notNull(),
  url: text('url'),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'),
  category: emotionCategoryEnum('category').notNull(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isSaved: boolean('is_saved').default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const userSavedResources = pgTable('user_saved_resources', {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  resourceId: uuid('resource_id').notNull().references(() => learningResources.id, { onDelete: 'cascade' }),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
  notes: text('notes'),
});


const ResourceAssessmentQuestions = pgTable('resource_assessment_questions', {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text('question').notNull(),
  resourceId: uuid('resource_id').notNull().references(() => learningResources.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const ResourceAssessmentOptions = pgTable('resource_assessment_options', {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid('question_id').notNull().references(() => ResourceAssessmentQuestions.id, { onDelete: 'cascade' }),
  option: text('option').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isCorrect: boolean("is_correct").default(false).notNull()
});


const ResourceAssessmentResults = pgTable('resource_assessment_results', {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() =>   User.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id')
    .notNull()
    .references(() => ResourceAssessmentQuestions.id, { onDelete: 'cascade' }),
  choiceId: uuid('choice_id').notNull().references(() => ResourceAssessmentOptions.id, { onDelete: 'cascade' }),
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
});

const ResourceAssessmentScore = pgTable('resource_assessment_score', {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() =>   User.id, { onDelete: 'cascade' }),
  questionId: uuid("question_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
});



// // Personalized exercises based on assessment
// export const personalizedExercises = pgTable('personalized_exercises', {
//   id: uuid("id").defaultRandom().primaryKey(),
//   userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
//   title: text('title').notNull(),
//   description: text('description').notNull(),
//   category: emotionCategoryEnum('category').notNull(),
//   content: text('content').notNull(),
//   isCompleted: boolean('is_completed').default(false),
//   completedAt: timestamp('completed_at'),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   dueDate: timestamp('due_date'),
// });

// // Growth tracking entries
// export const emotionalGrowthEntries = pgTable('emotional_growth_entries', {
//   id: uuid("id").defaultRandom().primaryKey(),
//   userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
//   entryDate: timestamp('entry_date').defaultNow().notNull(),
//   moodRating: integer('mood_rating').notNull(), // Scale 1-10
//   notes: text('notes'),
//   challenges: text('challenges'),
//   victories: text('victories'),
//   goals: text('goals'),
// });










// const ChallengeElementProgress = pgTable("challenge_element_progress", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
//   element_id: uuid("element_id").references(() => ChallengeElements.id, { onDelete: "cascade" }),
//   is_completed: boolean("is_completed").default(false),
//   completion_date: timestamp("completion_date"),
//   notes: text("notes"),
//   created_at: timestamp("created_at").defaultNow(),
//   updated_at: timestamp("updated_at").defaultNow()
// });

// const UserChallengeParticipation = pgTable("user_challenge_participation", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
//   challenge_id: uuid("challenge_id").references(() => Challenges.id, { onDelete: "cascade" }),
//   join_date: timestamp("join_date").defaultNow(),
//   total_points_earned: integer("total_points_earned").default(0),
//   streak_days: integer("streak_days").default(0),
//   is_active: boolean("is_active").default(true),
//   created_at: timestamp("created_at").defaultNow(),
//   updated_at: timestamp("updated_at").defaultNow(),
// });

// export const challengesRelations = relations(Challenges, ({ many, one }) => ({
//   group: one(Group, {
//     fields: [Challenges.group_id],
//     references: [Group.id]
//   }),
//   creator: one(User, {
//     fields: [Challenges.user_id],
//     references: [User.id]
//   }),
//   elements: many(ChallengeElements),
//   participants: many(UserChallengeParticipation)
// }));

// export const challengeElementsRelations = relations(ChallengeElements, ({ many, one }) => ({
//   challenge: one(Challenges, {
//     fields: [ChallengeElements.challenge_id],
//     references: [Challenges.id]
//   }),
//   progress: many(ChallengeElementProgress)
// }));

// export const challengeElementProgressRelations = relations(ChallengeElementProgress, ({ one }) => ({
//   element: one(ChallengeElements, {
//     fields: [ChallengeElementProgress.element_id],
//     references: [ChallengeElements.id]
//   }),
//   user: one(User, {
//     fields: [ChallengeElementProgress.user_id],
//     references: [User.id]
//   })
// }));

// export const userChallengeParticipationRelations = relations(UserChallengeParticipation, ({ one }) => ({
//   challenge: one(Challenges, {
//     fields: [UserChallengeParticipation.challenge_id],
//     references: [Challenges.id]
//   }),
//   user: one(User, {
//     fields: [UserChallengeParticipation.user_id],
//     references: [User.id]
//   })
// }));

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
  "MOOD_TRACKED",
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
  MentalHealthTracker,
  Event,
  AIConversation,
  Analytics,
  Message,
  HealthTest,
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
  ResourceAssessmentQuestions,
  ResourceAssessmentOptions,
  ResourceAssessmentResults,
  ResourceAssessmentScore,
  ChallengeFeedback,
  Challenges,
  ChallengeElements,
  learningResources,
  Todo,
  TodoPriorityEnum,
  TodoStatusEnum,
  ActivityHistory,
  ActivityTypeEnum,
  userOnBoardingProfile,
  purposeEnum
};
