"use client";

import { useState } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "danger"
    | "warning"
    | "info"
    | "success";
  className?: string;
}

export default function Button({
  label,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className,
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      setIsLoading(true);
      try {
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const buttonClasses = `
    px-4
    py-2
    rounded
    font-medium
    transition
    duration-200
    ease-in-out
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    ${
      variant === "primary"
        ? "bg-blue-500 text-white hover:bg-blue-700"
        : variant === "secondary"
        ? "bg-gray-800 text-white hover:bg-gray-900"
        : variant === "outline"
        ? "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-100"
        : variant === "ghost"
        ? "bg-transparent text-blue-500 hover:text-blue-700"
        : variant === "link"
        ? "bg-transparent text-blue-500 hover:text-blue-700 underline"
        : variant === "danger"
        ? "bg-red-500 text-white hover:bg-red-700"
        : variant === "warning"
        ? "bg-yellow-500 text-white hover:bg-yellow-700"
        : variant === "info"
        ? "bg-blue-500 text-white hover:bg-blue-700"
        : variant === "success"
        ? "bg-green-500 text-white hover:bg-green-700"
        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
    }
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={buttonClasses}
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
}