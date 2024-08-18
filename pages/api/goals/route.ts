"use client";

import { NextApiRequest, NextApiResponse } from "next";
import { createGoal, getGoals, updateGoal, deleteGoal } from "@/utils/helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Goal } from "@/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      try {
        const goals = await getGoals(userId);
        res.status(200).json(goals);
      } catch (error) {
        res.status(500).json({ message: "Failed to get goals" });
      }
      break;
    case "POST":
      try {
        const goal: Goal = JSON.parse(req.body);
        const newGoal = await createGoal(userId, goal);
        res.status(201).json(newGoal);
      } catch (error) {
        res.status(500).json({ message: "Failed to create goal" });
      }
      break;
    case "PUT":
      try {
        const goalId = req.query.id as string;
        const goal: Goal = JSON.parse(req.body);
        const updatedGoal = await updateGoal(userId, goalId, goal);
        res.status(200).json(updatedGoal);
      } catch (error) {
        res.status(500).json({ message: "Failed to update goal" });
      }
      break;
    case "DELETE":
      try {
        const goalId = req.query.id as string;
        await deleteGoal(userId, goalId);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ message: "Failed to delete goal" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}