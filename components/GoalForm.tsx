"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import {
  createGoal,
  updateGoal,
  getGoal,
} from "@/utils/helpers";
import { Goal } from "@/utils/types";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";

interface GoalFormProps {
  onSubmit: (goal: Goal) => void;
  isLoading: boolean;
  error?: string;
  initialValues?: Goal;
}

export default function GoalForm({
  onSubmit,
  isLoading,
  error,
  initialValues,
}: GoalFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [goalType, setGoalType] = useState<string>(
    initialValues?.type || ""
  );
  const [targetValue, setTargetValue] = useState<number>(
    initialValues?.target || 0
  );
  const [deadline, setDeadline] = useState<string>(
    initialValues?.deadline || ""
  );
  const [trackingMethod, setTrackingMethod] = useState<string>(
    initialValues?.trackingMethod || ""
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const goal: Goal = {
      type: goalType,
      target: targetValue,
      deadline,
      trackingMethod,
    };
    onSubmit(goal);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Goal Type"
        type="text"
        value={goalType}
        onChange={(e) => setGoalType(e.target.value)}
      />
      <Input
        label="Target Value"
        type="number"
        value={targetValue}
        onChange={(e) => setTargetValue(Number(e.target.value))}
      />
      <Input
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <Select
        label="Tracking Method"
        value={trackingMethod}
        onChange={(e) => setTrackingMethod(e.target.value)}
        options={[
          { value: "progress_bar", label: "Progress Bar" },
          { value: "chart", label: "Chart" },
          { value: "manual_log", label: "Manual Log" },
        ]}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button
        type="submit"
        label={isLoading ? "Saving..." : "Save Goal"}
        disabled={isLoading}
      />
    </form>
  );
}