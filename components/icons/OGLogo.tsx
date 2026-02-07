"use client";

interface OGLogoProps {
  className?: string;
  size?: number;
}

export function OGLogo({ className, size = 32 }: OGLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="32" height="32" rx="8" fill="url(#og-gradient)" />

      {/* OG text - bold connected letters */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.5"
      >
        OG
      </text>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="og-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default OGLogo;
