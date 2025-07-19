import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "outline";
}

export default function Button({
  children,
  onClick,
  type = "button",
  className,
  variant = "primary",
  ...rest
}: ButtonProps) {
  let variantClasses = "";
  if (variant === "primary") {
    variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
  } else if (variant === "outline") {
    variantClasses =
      "bg-background text-foreground border border-border hover:bg-muted";
  }

  const baseClasses =
    "px-4 py-2 rounded-md font-semibold transition-colors duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-ring/50 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const combinedClasses = twMerge(baseClasses, variantClasses, className);

  return (
    <button type={type} onClick={onClick} className={combinedClasses} {...rest}>
      {children}
    </button>
  );
}
