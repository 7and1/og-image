import type { TemplateProps } from "@/types";

/**
 * Blog Template
 *
 * Clean reading-focused design for articles and blog posts.
 * Perfect for content creators and publishers.
 */
export function BlogTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  const titleFontSize = title.length > 60 ? 38 : title.length > 45 ? 46 : 54;

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
        padding: 70,
        position: "relative",
      }}
    >
      {/* Top decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}66 100%)`,
          display: "flex",
        }}
      />

      {/* Category tag with icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
          padding: "10px 20px",
          background: `${accentColor}15`,
          borderRadius: 30,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <span style={{ fontSize: 24, display: "flex" }}>{icon}</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          Article
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: titleFontSize,
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.2,
          maxWidth: "95%",
          display: "flex",
        }}
      >
        {title}
      </div>

      {/* Description */}
      {description && (
        <div
          style={{
            fontSize: 22,
            color: textColor,
            opacity: 0.7,
            marginTop: 24,
            lineHeight: 1.5,
            maxWidth: "85%",
            display: "flex",
          }}
        >
          {description}
        </div>
      )}

      {/* Author section placeholder */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 36,
          paddingTop: 24,
          borderTop: `1px solid ${textColor}15`,
          width: "100%",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#ffffff",
          }}
        >
          ✍️
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: textColor,
              display: "flex",
            }}
          >
            Author Name
          </span>
          <span
            style={{
              fontSize: 14,
              color: textColor,
              opacity: 0.6,
              display: "flex",
            }}
          >
            5 min read
          </span>
        </div>
      </div>
    </div>
  );
}

export default BlogTemplate;
