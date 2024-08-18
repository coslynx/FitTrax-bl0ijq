"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import GoalForm from "@/components/GoalForm";
import { useRouter } from "next/navigation";
import { updateGoal } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import type { Goal } from "@/utils/types";

export default function UpdateGoalPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { goals, setGoals } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isLoading: goalLoading, error: goalError, data: goal } = useQuery(
    ["goal", params.id],
    () => getGoal(params.id)
  );

  const handleSubmit = async (updatedGoal: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedGoalData = await updateGoal(
        session?.user?.id,
        params.id,
        updatedGoal
      );
      const updatedGoals = goals.map((g: Goal) =>
        g.id === params.id ? updatedGoalData : g
      );
      setGoals(updatedGoals);
      router.push("/goals/list");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (goalLoading) {
    return <p>Loading...</p>;
  }

  if (goalError) {
    return <p>Error: {goalError.message}</p>;
  }

  if (goal) {
    return (
      <main className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Update Goal</h1>
        <GoalForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          initialValues={goal}
        />
      </main>
    );
  }

  return <p>Goal not found.</p>;
}

async function getGoal(id: string) {
  // Implement logic to fetch goal data from the backend API
  // using the provided goal ID
}