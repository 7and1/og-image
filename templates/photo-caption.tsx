import type { TemplateProps } from "../types";

export function PhotoCaptionTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
  backgroundImageSrc,
  overlayOpacity = 0.65,
}: TemplateProps): React.ReactElement {
  const overlay = Math.min(0.95, Math.max(0, overlayOpacity));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
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
          background: `linear-gradient(180deg, rgba(0,0,0,${overlay * 0.55}) 0%, rgba(0,0,0,${overlay}) 70%, rgba(0,0,0,${Math.min(0.95, overlay + 0.2)}) 100%)`,
        }}
      />

      <div style={{ flex: 1 }} />

      <div
        style={{
          position: "relative",
          padding: 56,
          borderTop: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(0,0,0,0.58)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              background: accentColor,
              color: "#0b1020",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {icon}
          </div>
          <div
            style={{
              width: 110,
              height: 6,
              borderRadius: 99,
              background: accentColor,
            }}
          />
        </div>

        <div
          style={{
            fontSize: title.length > 48 ? 56 : 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: textColor,
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 1020,
          }}
        >
          {title}
        </div>

        {description ? (
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: textColor,
              opacity: 0.9,
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 980,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PhotoCaptionTemplate;
