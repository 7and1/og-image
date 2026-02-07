import type { TemplateProps } from "../types";

/**
 * Split Template
 *
 * Two-column layout with icon on one side and content on the other.
 * Perfect for product showcases and feature highlights.
 */
export function SplitTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  const titleFontSize = title.length > 50 ? 40 : title.length > 35 ? 48 : 54;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: backgroundColor,
        fontFamily: "Inter",
      }}
    >
      {/* Left side - Icon */}
      <div
        style={{
          width: "40%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: accentColor,
          position: "relative",
        }}
      >
        {/* Diagonal line decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: -40,
            width: 80,
            height: "100%",
            background: backgroundColor,
            transform: "skewX(-6deg)",
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: 120,
            display: "flex",
            position: "relative",
            zIndex: 1,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Right side - Content */}
      <div
        style={{
          width: "60%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "60px 60px 60px 80px",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: titleFontSize,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.15,
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
              opacity: 0.8,
              marginTop: 24,
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            {description}
          </div>
        )}

        {/* Accent underline */}
        <div
          style={{
            width: 60,
            height: 4,
            background: accentColor,
            marginTop: 32,
            borderRadius: 2,
            display: "flex",
          }}
        />
      </div>
    </div>
  );
}

export default SplitTemplate;
