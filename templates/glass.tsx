import type { TemplateProps } from "../types";

/**
 * Glass Template
 *
 * Glassmorphism-inspired design with frosted effect.
 * Perfect for modern apps and premium products.
 */
export function GlassTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  const titleFontSize = title.length > 50 ? 44 : title.length > 35 ? 52 : 58;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: backgroundColor,
        fontFamily: "Inter",
        padding: 60,
        position: "relative",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.4,
          filter: "blur(60px)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 150,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.3,
          filter: "blur(80px)",
          display: "flex",
        }}
      />

      {/* Glass card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px 60px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "85%",
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: 64,
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
              opacity: 0.85,
              marginTop: 20,
              textAlign: "center",
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlassTemplate;
