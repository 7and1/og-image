import type { TemplateProps } from "../types";

/**
 * Minimal Template
 *
 * Clean and simple design with lots of whitespace.
 * Perfect for professional and corporate use.
 */
export function MinimalTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  const titleFontSize = title.length > 50 ? 42 : title.length > 35 ? 50 : 58;

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
        padding: 80,
      }}
    >
      {/* Icon with accent background */}
      <div
        style={{
          fontSize: 48,
          marginBottom: 32,
          padding: 20,
          background: accentColor,
          borderRadius: 16,
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
            fontSize: 24,
            color: textColor,
            opacity: 0.7,
            marginTop: 24,
            textAlign: "center",
            maxWidth: "70%",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}

export default MinimalTemplate;
