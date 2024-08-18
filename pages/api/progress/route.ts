"use client";

import { NextApiRequest, NextApiResponse } from "next";
import { createProgress, getProgress } from "@/utils/helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Progress } from "@/utils/types";

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
        const goalId = req.query.goalId as string;
        const progress = await getProgress(userId, goalId);
        res.status(200).json(progress);
      } catch (error) {
        res.status(500).json({ message: "Failed to get progress" });
      }
      break;
    case "POST":
      try {
        const goalId = req.query.goalId as string;
        const progress: Progress = JSON.parse(req.body);
        const newProgress = await createProgress(userId, goalId, progress);
        res.status(201).json(newProgress);
      } catch (error) {
        res.status(500).json({ message: "Failed to create progress" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}