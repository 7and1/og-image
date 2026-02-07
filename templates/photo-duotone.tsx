import type { TemplateProps } from "../types";

export function PhotoDuotoneTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
  backgroundImageSrc,
  overlayOpacity = 0.7,
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
            filter: "grayscale(1)",
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: accentColor,
          opacity: overlay,
          mixBlendMode: "multiply",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)",
          opacity: 0.9,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 22,
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              color: textColor,
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: 18,
              color: textColor,
              opacity: 0.78,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Duotone Photo
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 48 ? 62 : 72,
            fontWeight: 900,
            letterSpacing: "-0.04em",
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
              maxWidth: 920,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {description}
          </div>
        ) : null}

        <div
          style={{
            width: 220,
            height: 10,
            borderRadius: 99,
            background: "rgba(255,255,255,0.24)",
            border: "1px solid rgba(255,255,255,0.24)",
          }}
        />
      </div>
    </div>
  );
}

export default PhotoDuotoneTemplate;
