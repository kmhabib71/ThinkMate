import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg border border-gray-100 dark:border-gray-700",
        className
      )}
    >
      {children}
    </div>
  );
};

/* Card Header Component */
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader = ({ children, className }: CardHeaderProps) => {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

/* Card Title Component */
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle = ({ children, className }: CardTitleProps) => {
  return (
    <h3 className={cn("text-xl font-bold mb-1 dark:text-white", className)}>
      {children}
    </h3>
  );
};

/* Card Description Component */
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const CardDescription = ({ children, className }: CardDescriptionProps) => {
  return (
    <p className={cn("text-gray-600 dark:text-gray-300", className)}>
      {children}
    </p>
  );
};

/* Card Content Component */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent = ({ children, className }: CardContentProps) => {
  return <div className={cn("py-2", className)}>{children}</div>;
};

/* Card Footer Component */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter = ({ children, className }: CardFooterProps) => {
  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-gray-100 dark:border-gray-700",
        className
      )}
    >
      {children}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
