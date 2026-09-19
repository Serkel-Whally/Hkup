"use client";

import React from "react";

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`bg-white shadow-sm rounded-lg ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header {...props} className={`px-4 py-3 border-b ${className}`.trim()}>
      {children}
    </header>
  );
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div {...props} className={`p-4 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 {...props} className={`text-lg font-semibold ${className}`.trim()}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className={`text-sm text-muted-foreground ${className}`.trim()}>
      {children}
    </p>
  );
}

export default Card;
