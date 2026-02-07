import type { TemplateProps } from "../types";

/**
 * Gradient Template
 *
 * A beautiful gradient background template with centered content.
 * Perfect for startup landing pages and product announcements.
 *
 * Features:
 * - Dynamic gradient or solid color background
 * - Large emoji/icon display
 * - Responsive text sizing based on title length
 * - Subtle accent line decoration
 */
export function GradientTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  // Dynamic font size based on title length
  const titleFontSize = title.length > 50 ? 44 : title.length > 35 ? 52 : 60;

  // Check if background is a gradient
  const isGradient = backgroundColor.includes("gradient");
  const bgStyle = isGradient
    ? backgroundColor
    : `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustColor(backgroundColor, -30)} 100%)`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: bgStyle,
        fontFamily: "Inter",
        padding: 60,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.1,
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontSize: 72,
          marginBottom: 24,
          display: "flex",
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: titleFontSize,
          fontWeight: 700,
          color: textColor,
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "90%",
          display: "flex",
        }}
      >
        {title}
      </div>

      {/* Description */}
      {description && (
        <div
          style={{
            fontSize: 26,
            color: textColor,
            opacity: 0.85,
            marginTop: 20,
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          {description}
        </div>
      )}

      {/* Accent line */}
      <div
        style={{
          width: 80,
          height: 4,
          background: accentColor,
          borderRadius: 2,
          marginTop: 32,
          display: "flex",
        }}
      />
    </div>
  );
}

/**
 * Adjusts a hex color brightness
 */
function adjustColor(color: string, amount: number): string {
  // Handle non-hex colors
  if (!color.startsWith("#")) return color;

  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default GradientTemplate;
