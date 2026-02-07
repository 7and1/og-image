import type { TemplateProps } from "../types";

/**
 * Startup Template
 *
 * Clean, professional startup vibe with subtle branding.
 * Perfect for YC-style startups and tech companies.
 */
export function StartupTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  const titleFontSize = title.length > 50 ? 44 : title.length > 35 ? 54 : 64;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: backgroundColor,
        fontFamily: "Inter",
        padding: 60,
        position: "relative",
      }}
    >
      {/* Top bar with dots */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          display: "flex",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#ef4444",
            display: "flex",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fbbf24",
            display: "flex",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: accentColor,
            display: "flex",
          }}
        />
      </div>

      {/* Icon with glow effect */}
      <div
        style={{
          fontSize: 72,
          marginBottom: 28,
          padding: 16,
          background: `${accentColor}20`,
          borderRadius: 20,
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
          lineHeight: 1.15,
          maxWidth: "85%",
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
            opacity: 0.7,
            marginTop: 20,
            textAlign: "center",
            maxWidth: "75%",
            lineHeight: 1.45,
            display: "flex",
          }}
        >
          {description}
        </div>
      )}

      {/* Bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accentColor,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 16,
            color: textColor,
            opacity: 0.5,
            fontWeight: 500,
            display: "flex",
          }}
        >
          og-image.org
        </div>
      </div>
    </div>
  );
}

export default StartupTemplate;
