import type { TemplateProps } from "../types";

/**
 * Modern Template
 *
 * Sleek dark design with neon accent colors.
 * Perfect for tech products and SaaS applications.
 */
export function ModernTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  const titleFontSize = title.length > 50 ? 44 : title.length > 35 ? 52 : 60;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        background: backgroundColor,
        fontFamily: "Inter",
        padding: 60,
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: accentColor,
          display: "flex",
        }}
      />

      {/* Icon in top right */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 60,
          fontSize: 64,
          display: "flex",
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "80%",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: titleFontSize,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.1,
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
              color: accentColor,
              marginTop: 20,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Bottom decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 60,
          display: "flex",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: accentColor,
            display: "flex",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: accentColor,
            opacity: 0.5,
            display: "flex",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: accentColor,
            opacity: 0.25,
            display: "flex",
          }}
        />
      </div>
    </div>
  );
}

export default ModernTemplate;
