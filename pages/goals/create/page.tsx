"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import GoalForm from "@/components/GoalForm";
import { useRouter } from "next/navigation";
import { createGoal } from "@/utils/helpers";

export default function CreateGoalPage() {
  const { data: session } = useSession();
  const { goals, setGoals } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (goal: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const newGoal = await createGoal(session?.user?.id, goal);
      setGoals([...goals, newGoal]);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Create New Goal</h1>
      <GoalForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </main>
  );
}