import { supabase } from "@/server/supabase";
import { API_BASE_URL } from "@/utils/constants";
import { Goal, Progress, User, Activity } from "@/utils/types";
import axios from "axios";

export const getUserProfile = async (userId: string | undefined) => {
  try {
    if (!userId) {
      return null;
    }
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      throw new Error("Failed to get user profile");
    }
    return user;
  } catch (error: any) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
};

export const updateUserProfile = async (userId: string | undefined, user: User) => {
  try {
    if (!userId) {
      return null;
    }
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        name: user.name,
        email: user.email,
      })
      .eq("id", userId)
      .single();
    if (error) {
      throw new Error("Failed to update user profile");
    }
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating user profile:", error.message);
    throw error;
  }
};

export const createGoal = async (userId: string | undefined, goal: Goal) => {
  try {
    if (!userId) {
      return null;
    }
    const { data: newGoal, error } = await supabase
      .from("goals")
      .insert({
        user_id: userId,
        type: goal.type,
        target: goal.target,
        deadline: goal.deadline,
        trackingMethod: goal.trackingMethod,
      })
      .single();
    if (error) {
      throw new Error("Failed to create goal");
    }
    return newGoal;
  } catch (error: any) {
    console.error("Error creating goal:", error.message);
    throw error;
  }
};

export const getGoals = async (userId: string | undefined) => {
  try {
    if (!userId) {
      return [];
    }
    const { data: goals, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      throw new Error("Failed to get goals");
    }
    return goals;
  } catch (error: any) {
    console.error("Error fetching goals:", error.message);
    throw error;
  }
};

export const updateGoal = async (
  userId: string | undefined,
  goalId: string,
  goal: Goal
) => {
  try {
    if (!userId) {
      return null;
    }
    const { data: updatedGoal, error } = await supabase
      .from("goals")
      .update({
        type: goal.type,
        target: goal.target,
        deadline: goal.deadline,
        trackingMethod: goal.trackingMethod,
      })
      .eq("id", goalId)
      .eq("user_id", userId)
      .single();
    if (error) {
      throw new Error("Failed to update goal");
    }
    return updatedGoal;
  } catch (error: any) {
    console.error("Error updating goal:", error.message);
    throw error;
  }
};

export const deleteGoal = async (userId: string | undefined, goalId: string) => {
  try {
    if (!userId) {
      return;
    }
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goalId)
      .eq("user_id", userId);
    if (error) {
      throw new Error("Failed to delete goal");
    }
  } catch (error: any) {
    console.error("Error deleting goal:", error.message);
    throw error;
  }
};

export const createProgress = async (
  userId: string | undefined,
  goalId: string,
  progress: Progress
) => {
  try {
    if (!userId) {
      return null;
    }
    const { data: newProgress, error } = await supabase
      .from("progress")
      .insert({
        goal_id: goalId,
        value: progress.value,
        timestamp: progress.timestamp,
      })
      .single();
    if (error) {
      throw new Error("Failed to create progress");
    }
    return newProgress;
  } catch (error: any) {
    console.error("Error creating progress:", error.message);
    throw error;
  }
};

export const getProgress = async (
  userId: string | undefined,
  goalIds: string[]
) => {
  try {
    if (!userId) {
      return [];
    }
    const { data: progress, error } = await supabase
      .from("progress")
      .select("*")
      .in("goal_id", goalIds);
    if (error) {
      throw new Error("Failed to get progress");
    }
    return progress;
  } catch (error: any) {
    console.error("Error fetching progress:", error.message);
    throw error;
  }
};

export const createActivity = async (
  userId: string | undefined,
  activity: Activity
) => {
  try {
    if (!userId) {
      return null;
    }
    const { data: newActivity, error } = await supabase
      .from("activity")
      .insert({
        user_id: userId,
        goal_id: activity.goal?.id,
        message: activity.message,
      })
      .single();
    if (error) {
      throw new Error("Failed to create activity");
    }
    return newActivity;
  } catch (error: any) {
    console.error("Error creating activity:", error.message);
    throw error;
  }
};

export const getActivities = async (userId: string | undefined) => {
  try {
    if (!userId) {
      return [];
    }
    const { data: activities, error } = await supabase
      .from("activity")
      .select(
        "*, user:users(name, profile_picture), goal:goals(type)"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error("Failed to get activities");
    }
    return activities;
  } catch (error: any) {
    console.error("Error fetching activities:", error.message);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error("Failed to sign in");
    }
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};