import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to get authenticated user
async function getAuthenticatedUser(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

// Get all tasks for the authenticated user
export const getUserTasks = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    let query = ctx.db.query("tasks").withIndex("by_user", (q) => q.eq("userId", userId));
    
    if (args.status) {
      query = ctx.db.query("tasks").withIndex("by_user_and_status", (q) => 
        q.eq("userId", userId).eq("status", args.status!)
      );
    }
    
    const tasks = await query.order("desc").collect();
    
    if (args.priority) {
      return tasks.filter(task => task.priority === args.priority);
    }
    
    return tasks;
  },
});

// Search tasks
export const searchTasks = query({
  args: {
    searchTerm: v.string(),
    status: v.optional(v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    if (!args.searchTerm.trim()) {
      return [];
    }
    
    let searchQuery = ctx.db
      .query("tasks")
      .withSearchIndex("search_tasks", (q) => 
        q.search("title", args.searchTerm).eq("userId", userId)
      );
    
    if (args.status) {
      searchQuery = searchQuery.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    return await searchQuery.take(20);
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    if (!args.title.trim()) {
      throw new Error("Task title is required");
    }
    
    return await ctx.db.insert("tasks", {
      title: args.title.trim(),
      description: args.description.trim(),
      status: "pending",
      priority: args.priority,
      dueDate: args.dueDate,
      userId,
    });
  },
});

// Update a task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    
    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only update your own tasks");
    }
    
    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title.trim();
    if (args.description !== undefined) updates.description = args.description.trim();
    if (args.status !== undefined) updates.status = args.status;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    
    await ctx.db.patch(args.taskId, updates);
    return args.taskId;
  },
});

// Delete a task
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    
    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own tasks");
    }
    
    await ctx.db.delete(args.taskId);
    return args.taskId;
  },
});

// Get task statistics
export const getTaskStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      highPriority: tasks.filter(t => t.priority === "high").length,
    };
    
    return stats;
  },
});
