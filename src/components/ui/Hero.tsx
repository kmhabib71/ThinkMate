import React from "react";
import Image from "next/image";
import { Button } from "./Button";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick?: () => void;
}

const Hero = ({
  title = "Welcome to ThinkMate",
  subtitle = "Your AI-powered writing companion. Take notes, generate ideas, and enhance your writing with the power of AI.",
  ctaText = "Get Started",
  onCtaClick,
}: HeroProps) => {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center"
      id="home"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="ThinkMate Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <Button variant="primary" size="lg" onClick={onCtaClick}>
          {ctaText}
        </Button>
      </div>
    </section>
  );
};

export { Hero };
