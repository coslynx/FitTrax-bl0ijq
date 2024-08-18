"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LineController, LineElement, PointElement, LinearScale, Title } from "chart.js";
import type { ChartData } from "chart.js";
import type { Goal, Progress } from "@/utils/types";

Chart.register(
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title
);

interface ProgressChartProps {
  goals: Goal[];
  progress: Progress[];
  className?: string;
}

export default function ProgressChart({ goals, progress, className }: ProgressChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  useEffect(() => {
    if (!goals || !progress) return;

    const data = goals.map((goal) => {
      const goalProgress = progress.filter((p) => p.goal_id === goal.id);

      const labels = goalProgress.map((p) => new Date(p.timestamp).toLocaleDateString());

      const values = goalProgress.map((p) => p.value);

      return {
        label: goal.type,
        data: values,
        borderColor: `hsl(${Math.random() * 360}, 50%, 50%)`,
        tension: 0.2,
      };
    });

    setChartData({
      labels,
      datasets: data,
    });
  }, [goals, progress]);

  if (!chartData) return null;

  return (
    <div className={`w-full h-full ${className}`}>
      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Progress Chart",
          },
        },
      }} />
    </div>
  );
}