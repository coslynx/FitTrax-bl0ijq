"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { getActivities } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@/utils/types";
import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import { BsFillChatFill } from "react-icons/bs";

export default function SocialFeed() {
  const { data: session } = useSession();
  const { userProfile } = useStore();
  const [activities, setActivities] = useState<Activity[]>([]);

  const { isLoading, error, data: activitiesData } = useQuery(
    ["activities"],
    () => getActivities(session?.user?.id)
  );

  useEffect(() => {
    if (activitiesData) {
      setActivities(activitiesData);
    }
  }, [activitiesData]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {activities.map((activity: Activity) => (
        <div
          key={activity.id}
          className="bg-white rounded-md shadow-md p-4 flex items-center gap-4"
        >
          <UserAvatar user={activity.user} />
          <div className="flex flex-col gap-2">
            <p className="font-bold">{activity.user.name}</p>
            <p>{activity.message}</p>
            {activity.goal && (
              <p className="text-gray-500">
                Achieved a new milestone for their {activity.goal.type} goal!
              </p>
            )}
            <div className="flex gap-2">
              <Button
                label="Like"
                variant="outline"
                className="flex items-center gap-2"
              >
                <BsFillChatFill className="h-4 w-4" />
                {activity.likes_count}
              </Button>
              <Button
                label="Comment"
                variant="outline"
                className="flex items-center gap-2"
              >
                <BsFillChatFill className="h-4 w-4" />
                {activity.comments_count}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}