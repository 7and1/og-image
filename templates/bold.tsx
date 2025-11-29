import type { TemplateProps } from "@/types";

/**
 * Bold Template
 *
 * High contrast, attention-grabbing design.
 * Perfect for announcements and marketing campaigns.
 */
export function BoldTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  const titleFontSize = title.length > 40 ? 52 : title.length > 25 ? 64 : 76;

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
        padding: 50,
        position: "relative",
      }}
    >
      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          width: 60,
          height: 60,
          borderTop: `6px solid ${accentColor}`,
          borderLeft: `6px solid ${accentColor}`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderBottom: `6px solid ${accentColor}`,
          borderRight: `6px solid ${accentColor}`,
          display: "flex",
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontSize: 80,
          marginBottom: 20,
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
          lineHeight: 1.05,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
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
            fontSize: 28,
            color: accentColor,
            marginTop: 24,
            textAlign: "center",
            maxWidth: "75%",
            lineHeight: 1.3,
            fontWeight: 600,
            display: "flex",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}

export default BoldTemplate;
