import React from "react";

interface RayzenLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function RayzenLogo({
  className = "flex items-center gap-2 select-none",
  iconClassName = "h-8 md:h-10 w-auto text-gray-900 dark:text-white",
  showText = true,
}: RayzenLogoProps) {
  // Check if the logo should be white (inverted)
  const isInverted = iconClassName.includes("text-white") || className.includes("text-white");
  
  // Clean up utility text color classes from the icon class name
  const cleanIconClass = iconClassName
    .replace(/\btext-(white|gray-\d+|slate-\d+|neutral-\d+|black|indigo-\d+)\b/g, "")
    .replace(/\bdark:text-white\b/g, "")
    .trim();

  return (
    <div className={className}>
      <img
        src="/src/assets/images/rayzen_logo_transparent.png"
        alt="Rayzen 3D"
        className={`${cleanIconClass} ${isInverted ? "invert" : ""}`}
      />
    </div>
  );
}
