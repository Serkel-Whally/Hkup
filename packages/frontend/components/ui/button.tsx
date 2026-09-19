"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
}

export function Button({ variant, className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none";
  return (
    <button {...props} className={`${base} ${className}`.trim()}>
      {children}
    </button>
  );
}

export default Button;

export function buttonVariants({ variant, className = "" }: { variant?: string; className?: string }) {
  // minimal variant resolver: extend as needed
  return `${className}`.trim();
}
