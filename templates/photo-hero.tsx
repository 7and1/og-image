import type { TemplateProps } from "../types";

export function PhotoHeroTemplate({
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
        fontFamily: "Inter",
        background: backgroundColor,
        overflow: "hidden",
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
          background: `linear-gradient(180deg, rgba(0,0,0,${overlay * 0.8}) 0%, rgba(0,0,0,${overlay}) 55%, rgba(0,0,0,${Math.min(0.95, overlay + 0.15)}) 100%)`,
        }}
      />

      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -220,
          width: 520,
          height: 520,
          borderRadius: 520,
          background: accentColor,
          opacity: 0.22,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          gap: 16,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.20)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: textColor,
            }}
          >
            {icon}
          </div>

          <div
            style={{
              width: 120,
              height: 8,
              borderRadius: 99,
              background: accentColor,
            }}
          />
        </div>

        <div
          style={{
            fontSize: title.length > 48 ? 60 : 68,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: textColor,
            maxWidth: 980,
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
              opacity: 0.92,
              maxWidth: 920,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PhotoHeroTemplate;
