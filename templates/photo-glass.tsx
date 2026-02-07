import type { TemplateProps } from "../types";

export function PhotoGlassTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
  backgroundImageSrc,
  overlayOpacity = 0.55,
}: TemplateProps): React.ReactElement {
  const overlay = Math.min(0.95, Math.max(0, overlayOpacity));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter",
        background: backgroundColor,
        overflow: "hidden",
        padding: 72,
      }}
    >
      {backgroundImageSrc ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${backgroundImageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${overlay})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.22), transparent 45%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent 55%)",
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 980,
          borderRadius: 36,
          border: "1px solid rgba(255,255,255,0.22)",
          background: "rgba(10,10,20,0.32)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          padding: 64,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 24,
              background: accentColor,
              color: "#0b1020",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textColor,
              opacity: 0.75,
              display: "flex",
            }}
          >
            OG Image Template
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 50 ? 58 : 66,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: textColor,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {title}
        </div>

        {description ? (
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: textColor,
              opacity: 0.9,
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 840,
            }}
          >
            {description}
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              background: accentColor,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: textColor,
              opacity: 0.8,
              display: "flex",
            }}
          >
            Photo-first design • Glass overlay • Bold typography
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoGlassTemplate;
