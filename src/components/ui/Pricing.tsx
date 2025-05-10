import React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  popular?: boolean;
  onCtaClick?: () => void;
}

interface PricingProps {
  title?: string;
  plans?: PricingPlan[];
  className?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with basic writing assistance",
    features: [
      { name: "Basic AI writing assistance", included: true },
      { name: "Up to 5 notes", included: true },
      { name: "Standard response time", included: true },
      { name: "Basic templates", included: true },
      { name: "Advanced features", included: false },
      { name: "Priority support", included: false },
    ],
    ctaText: "Get Started",
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Unlock the full power of ThinkMate for serious writers",
    features: [
      { name: "Advanced AI writing assistance", included: true },
      { name: "Unlimited notes", included: true },
      { name: "Faster response time", included: true },
      { name: "All premium templates", included: true },
      { name: "Advanced features", included: true },
      { name: "Priority support", included: true },
    ],
    ctaText: "Upgrade Now",
    popular: true,
  },
];

const Pricing = ({
  title = "Flexible Pricing",
  plans = defaultPlans,
  className,
}: PricingProps) => {
  return (
    <section
      className={cn("w-full py-16 bg-gray-100 dark:bg-gray-900", className)}
      id="pricing"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border relative",
                plan.popular
                  ? "border-green-400 shadow-lg"
                  : "border-gray-100 dark:border-gray-700"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-green-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              )}

              <h3 className="text-2xl font-bold dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center">
                    <span
                      className={cn(
                        "mr-2 h-5 w-5 rounded-full flex items-center justify-center",
                        feature.included
                          ? "bg-green-100 text-green-500"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {feature.included ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={cn(
                        feature.included
                          ? "text-gray-700 dark:text-gray-200"
                          : "text-gray-400 dark:text-gray-500"
                      )}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full"
                onClick={plan.onCtaClick}
              >
                {plan.ctaText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Pricing };
