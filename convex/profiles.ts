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

// Get user profile
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    return {
      user,
      profile,
    };
  },
});

// Create or update user profile
export const updateUserProfile = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    if (!args.firstName.trim() || !args.lastName.trim()) {
      throw new Error("First name and last name are required");
    }
    
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    const profileData = {
      userId,
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      bio: args.bio?.trim() || "",
    };
    
    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, profileData);
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", profileData);
    }
  },
});

// Generate upload URL for avatar
export const generateAvatarUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

// Update user avatar
export const updateUserAvatar = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    if (profile) {
      await ctx.db.patch(profile._id, { avatar: args.storageId });
    } else {
      await ctx.db.insert("userProfiles", {
        userId,
        firstName: "",
        lastName: "",
        avatar: args.storageId,
      });
    }
    
    return args.storageId;
  },
});
