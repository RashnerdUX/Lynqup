import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  rightIcon?: React.ReactNode;
}

export default function Input({ className, rightIcon, ...rest }: InputProps) {
  // Define base Tailwind CSS classes that apply to all inputs
  const baseClasses =
    "w-full p-3 border border-border rounded-md " +
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent " +
    "disabled:bg-muted disabled:cursor-not-allowed";

  const combinedClasses = twMerge(baseClasses, className);

  return (
    <div className="relative w-full">
      <input
        className={combinedClasses + (rightIcon ? " pr-10" : "")}
        {...rest}
      />
      {rightIcon && (
        <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
          {rightIcon}
        </span>
      )}
    </div>
  );
}
