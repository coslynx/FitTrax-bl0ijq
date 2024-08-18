"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useState } from "react";

export default function Navigation() {
  const { data: session } = useSession();
  const { setUserProfile } = useStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await session?.user?.id && setUserProfile(null);
    // Add logic to logout the user using NextAuth.js
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          FitTrax
        </Link>
        <div className="flex items-center">
          {session?.user ? (
            <>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="mr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              {showMenu && (
                <ul
                  className="absolute right-0 mt-2 py-2 shadow-md rounded-md bg-white"
                  onClick={() => setShowMenu(false)}
                >
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/goals/list">Goals</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4">
                Login
              </Link>
              <Link href="/signup" className="mr-4">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}