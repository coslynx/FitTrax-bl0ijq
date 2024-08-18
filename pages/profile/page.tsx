"use client";

import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "@/utils/helpers";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@/utils/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { setUserProfile } = useStore();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { isLoading: userLoading, error: userError, data: user } = useQuery(
    ["user"],
    () => getUserProfile(session?.user?.id),
    {
      onSuccess: (data) => {
        setUserData(data);
        setName(data.name);
        setEmail(data.email);
      },
    }
  );

  const { mutate: updateProfile } = useMutation(
    (data: User) => updateUserProfile(session?.user?.id, data),
    {
      onSuccess: (data) => {
        setUserProfile(data);
        setUserData(data);
        setIsEditing(false);
        router.push("/dashboard");
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  useEffect(() => {
    if (userLoading) return;
    if (user) {
      setUserProfile(user);
      setUserData(user);
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, userLoading, setUserProfile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name || !email) {
      setError("Please fill in all fields.");
      return;
    }
    updateProfile({
      name,
      email,
    });
  };

  if (userLoading) {
    return <p>Loading...</p>;
  }

  if (userError) {
    return <p>Error: {userError.message}</p>;
  }

  if (session?.user && userData) {
    return (
      <main className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="bg-white rounded-md shadow-md p-4">
          <div className="flex flex-col gap-2 items-center">
            {userData.profile_picture ? (
              <Image
                src={userData.profile_picture}
                alt={userData.name}
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-500"
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
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>
          {!isEditing && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}
          {isEditing && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-2"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && (
                <p className="text-red-500">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Please log in to view your profile.</p>
    </div>
  );
}