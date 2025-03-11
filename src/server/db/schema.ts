import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const User = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash"),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  username: varchar("username").notNull(),
  role: uuid("role").references(() => Role.id, { onDelete: "cascade" }), // 'peer', 'specialist', 'caregiver', 'patient'
  profilePicUrl: text("profile_pic_url"),
  bio: text("bio"),
  expertise: text("expertise"),
  anonymityPreference: varchar("anonymity_preference", { length: 50 }), // e.g., 'Anonymous', 'Public'
  badges: text("badges"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

const Role = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

const ForumPost = pgTable("forum_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  anonymous: boolean("anonymous").default(false),
});

const MentalHealthTracker = pgTable("mental_health_tracker", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  moodRating: integer("mood_rating").notNull(),
  stressLevel: integer("stress_level").notNull(),
  sleepQuality: integer("sleep_quality").notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
  // }, {
  //     constraints: {
  //         check: [
  //             'mood_rating BETWEEN 1 AND 10',
  //             'stress_level BETWEEN 1 AND 10',
  //             'sleep_quality BETWEEN 1 AND 10'
  //         ]
  //     }
});

const Event = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 50 }), // Time of the event
  location: text("location"), // In-person or online
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
  // Changed from 'GroupMember' to 'group_members'
  id: uuid("id").defaultRandom().primaryKey(),
  group_id: uuid("group_id").references(() => Group.id, {
    onDelete: "cascade",
  }), // Changed from groupId to group_id
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }), // Changed from userId to user_id
  joined_at: timestamp("joined_at").defaultNow(), // Changed from joinedAt to joined_at
});

export const groupRelations = relations(Group, ({ many, one }) => ({
  members: many(GroupMember),
  category: one(GroupCategories, {
    fields: [Group.categoryId],
    references: [GroupCategories.id]
  }),
  creator: one(User, {
    fields: [Group.userId],
    references: [User.id]
  })
}));




export const groupMemberRelations = relations(GroupMember, ({ one }) => ({
  group: one(Group, {
    fields: [GroupMember.group_id],
    references: [Group.id]
  }),
  user: one(User, {
    fields: [GroupMember.user_id],
    references: [User.id]
  })
}));

const Notification = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

const Post = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const Like = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
    postId: uuid("post_id").references(() => Post.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id").references(() => Comment.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniquePostLike: uniqueIndex("unique_post_like").on(
      table.userId,
      table.postId
    ),
    uniqueCommentLike: uniqueIndex("unique_comment_like").on(
      table.userId,
      table.commentId
    ),
  })
);

const Comment = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => Post.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const Reply = pgTable("replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").references(() => Comment.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  group_id: uuid("group_id").references(() => Group.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: text("image"),
  total_points: integer("total_points").default(0),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

const ChallengeElements = pgTable("challenge_elements", {
  id: uuid("id").defaultRandom().primaryKey(),
  challenge_id: uuid("challenge_id").references(() => Challenges.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  question: text("question"),
  points: integer("points").default(0).notNull(),
  order: integer("order").default(0),
  notes: text("notes"), 
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

const ChallengeElementProgress = pgTable("challenge_element_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  element_id: uuid("element_id").references(() => ChallengeElements.id, { onDelete: "cascade" }),
  is_completed: boolean("is_completed").default(false),
  completion_date: timestamp("completion_date"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

const UserChallengeParticipation = pgTable("user_challenge_participation", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  challenge_id: uuid("challenge_id").references(() => Challenges.id, { onDelete: "cascade" }),
  join_date: timestamp("join_date").defaultNow(),
  total_points_earned: integer("total_points_earned").default(0),
  streak_days: integer("streak_days").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const challengesRelations = relations(Challenges, ({ many, one }) => ({
  group: one(Group, {
    fields: [Challenges.group_id],
    references: [Group.id]
  }),
  creator: one(User, {
    fields: [Challenges.user_id],
    references: [User.id]
  }),
  elements: many(ChallengeElements),
  participants: many(UserChallengeParticipation)
}));

export const challengeElementsRelations = relations(ChallengeElements, ({ many, one }) => ({
  challenge: one(Challenges, {
    fields: [ChallengeElements.challenge_id],
    references: [Challenges.id]
  }),
  progress: many(ChallengeElementProgress)
}));

export const challengeElementProgressRelations = relations(ChallengeElementProgress, ({ one }) => ({
  element: one(ChallengeElements, {
    fields: [ChallengeElementProgress.element_id],
    references: [ChallengeElements.id]
  }),
  user: one(User, {
    fields: [ChallengeElementProgress.user_id],
    references: [User.id]
  })
}));

export const userChallengeParticipationRelations = relations(UserChallengeParticipation, ({ one }) => ({
  challenge: one(Challenges, {
    fields: [UserChallengeParticipation.challenge_id],
    references: [Challenges.id]
  }),
  user: one(User, {
    fields: [UserChallengeParticipation.user_id],
    references: [User.id]
  })
}));

export {
  User,
  UserProfile,
  ForumPost,
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
  Post,
  Like,
  Comment,
  Reply,
  sessions,
  verificationTokens,
  Role,
  Challenges,
  ChallengeElements,
  ChallengeElementProgress,
  UserChallengeParticipation
};
