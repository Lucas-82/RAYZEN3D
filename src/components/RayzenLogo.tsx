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
  textClassName = "font-display font-black tracking-wider text-xl md:text-2xl text-gray-900 dark:text-white",
  showText = true,
}: RayzenLogoProps) {
  return (
    <div className={className}>
      {/* 3D Isometric Hexagonal Logo Icon */}
      <svg
        viewBox="0 0 100 100"
        className={iconClassName}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Rhombus Face */}
        <path d="M50 12 L86 30 L50 48 L14 30 Z" />
        
        {/* Middle Layer Left */}
        <path d="M14 36 L47 52.5 L47 64.5 L14 48 Z" />
        
        {/* Middle Layer Right */}
        <path d="M53 52.5 L86 36 L86 48 L53 64.5 Z" />
        
        {/* Bottom Layer Left (tapers at the bottom point) */}
        <path d="M14 54 L47 70.5 L50 90 L14 72 Z" />
        
        {/* Bottom Layer Right (tapers at the bottom point) */}
        <path d="M86 54 L53 70.5 L50 90 L86 72 Z" />
      </svg>

      {/* Corporate logotype utilizing Orbitron font */}
      {showText && (
        <span className={textClassName}>
          RAYZEN3D
        </span>
      )}
    </div>
  );
}
