"use client";

import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import GoalCard from "@/components/GoalCard";
import ProgressChart from "@/components/ProgressChart";
import SocialFeed from "@/components/SocialFeed";
import { getGoals, getUserProfile, getProgress } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import type { Goal, Progress, User } from "@/utils/types";

export default function Dashboard() {
  const { data: session } = useSession();
  const { setUserProfile, setGoals } = useStore();
  const [userData, setUserData] = useState<User | null>(null);
  const [goalsData, setGoalsData] = useState<Goal[]>([]);
  const [progressData, setProgressData] = useState<Progress[]>([]);

  const { isLoading, error, data: goals } = useQuery(["goals"], () =>
    getGoals(session?.user?.id)
  );
  const { isLoading: userLoading, error: userError, data: user } = useQuery(
    ["user"],
    () => getUserProfile(session?.user?.id)
  );
  const { isLoading: progressLoading, error: progressError, data: progress } =
    useQuery(["progress"], () =>
      getProgress(session?.user?.id || "", goalsData.map((g) => g.id))
    );

  useEffect(() => {
    if (userLoading || progressLoading) return;
    if (user && goals) {
      setUserProfile(user);
      setGoals(goals);
      setUserData(user);
      setGoalsData(goals);
    }
  }, [user, goals, userLoading, progressLoading, setUserProfile, setGoals]);

  useEffect(() => {
    if (progress && goalsData) {
      setProgressData(progress);
    }
  }, [progress, goalsData]);

  if (session?.user && userData && goalsData) {
    return (
      <main className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Welcome, {userData.name}!</h1>
          <p className="text-gray-500">Your fitness journey begins here.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Active Goals</h2>
            <div className="flex flex-col gap-2">
              {goalsData.map((goal: Goal) => (
                <GoalCard key={goal.id} goal={goal} progressData={progressData} />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Progress Overview</h2>
            <ProgressChart
              goals={goalsData}
              progress={progressData}
              className="h-64"
            />
          </div>
          <div className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Community Feed</h2>
            <SocialFeed />
          </div>
        </div>
      </main>
    );
  }

  if (session?.user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Please log in to view your dashboard.</p>
    </div>
  );
}