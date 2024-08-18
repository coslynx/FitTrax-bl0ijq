"use client";

import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import GoalCard from "@/components/GoalCard";
import { getGoals } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import type { Goal } from "@/utils/types";
import { useRouter } from "next/navigation";

export default function GoalListPage() {
  const { data: session } = useSession();
  const { goals, setGoals } = useStore();
  const router = useRouter();

  const { isLoading, error, data: goalsData } = useQuery(
    ["goals"],
    () => getGoals(session?.user?.id),
    {
      onSuccess: (data) => {
        setGoals(data);
      },
    }
  );

  useEffect(() => {
    if (goalsData) {
      setGoals(goalsData);
    }
  }, [goalsData, setGoals]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (goalsData && goalsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>You have no active goals. Create a new goal!</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Your Active Goals</h1>
      <div className="flex flex-col gap-2">
        {goals.map((goal: Goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => router.push("/goals/create")}
      >
        Create New Goal
      </button>
    </main>
  );
}