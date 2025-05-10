import React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  className,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg border border-gray-100 dark:border-gray-700",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export { FeatureCard };
