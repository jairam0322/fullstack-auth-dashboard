import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .searchIndex("search_tasks", {
      searchField: "title",
      filterFields: ["userId", "status", "priority"],
    }),

  userProfiles: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
