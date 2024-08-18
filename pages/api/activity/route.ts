"use client";

import { NextApiRequest, NextApiResponse } from "next";
import { createActivity, getActivities } from "@/utils/helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Activity } from "@/utils/types";

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
        const activities = await getActivities(userId);
        res.status(200).json(activities);
      } catch (error) {
        res.status(500).json({ message: "Failed to get activities" });
      }
      break;
    case "POST":
      try {
        const activity: Activity = JSON.parse(req.body);
        const newActivity = await createActivity(userId, activity);
        res.status(201).json(newActivity);
      } catch (error) {
        res.status(500).json({ message: "Failed to create activity" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}