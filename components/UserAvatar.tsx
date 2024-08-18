"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/utils/types";

export default function UserAvatar() {
  const { data: session } = useSession();
  const { setUserProfile } = useStore();
  const [userData, setUserData] = useState<User | null>(null);

  const { isLoading, error, data: user } = useQuery(
    ["user"],
    () => getUserProfile(session?.user?.id)
  );

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      setUserProfile(user);
      setUserData(user);
    }
  }, [user, isLoading, setUserProfile]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (userData) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        {userData.profile_picture ? (
          <Image
            src={userData.profile_picture}
            alt={userData.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7.5 5.5a.5.5 0 01.5.5h10a.5.5 0 010-1h-10a.5.5 0 01-.5-.5zm.5-8a.5.5 0 01.5-.5h10a.5.5 0 010 1h-10a.5.5 0 01-.5-.5zm3 3a.5.5 0 01.5.5h4a.5.5 0 010-1h-4a.5.5 0 01-.5-.5zm-7.5 1a.5.5 0 01.5.5h7a.5.5 0 010-1h-7a.5.5 0 01-.5-.5zm.5-8a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return null;
}