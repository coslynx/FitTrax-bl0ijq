"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/utils/types";
import ProgressChart from "@/components/ProgressChart";
import { motion } from "framer-motion";
import {
  BsFillArrowUpRightCircleFill,
  BsFillArrowDownLeftCircleFill,
} from "react-icons/bs";

interface GoalCardProps {
  goal: Goal;
  progressData: Progress[];
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, progressData }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProgressChart, setShowProgressChart] = useState(false);

  useEffect(() => {
    const goalProgress = progressData.filter(
      (p) => p.goal_id === goal.id
    );

    if (goalProgress.length === 0) {
      setProgress(0);
      return;
    }

    const latestProgress = goalProgress[goalProgress.length - 1];

    if (latestProgress) {
      setProgress(latestProgress.value);
    }
  }, [progressData, goal.id]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    setShowProgressChart(true);
  };

  const progressPercentage =
    (progress / goal.target) * 100 || 0;

  return (
    <motion.div
      className="bg-white rounded-md shadow-md p-4 flex flex-col gap-2"
      animate={isExpanded ? { height: "auto" } : { height: "80px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{goal.type}</h3>
        <button onClick={handleExpand}>
          {isExpanded ? (
            <BsFillArrowDownLeftCircleFill className="h-6 w-6 text-gray-500" />
          ) : (
            <BsFillArrowUpRightCircleFill className="h-6 w-6 text-gray-500" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <p>
          {progress} / {goal.target}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-20 h-4 rounded-full bg-gray-300"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: progressPercentage >= 80 ? "green" : "blue",
            }}
          />
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>

      {isExpanded && (
        <div>
          <p className="text-gray-500">
            Deadline:{" "}
            {new Date(goal.deadline).toLocaleDateString()}
          </p>
          <p className="text-gray-500">
            Tracking Method: {goal.trackingMethod}
          </p>

          {showProgressChart && (
            <ProgressChart
              goals={[goal]}
              progress={progressData}
              className="h-48 mt-4"
            />
          )}
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;