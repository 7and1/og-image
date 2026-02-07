import type { TemplateProps } from "../types";

export function PhotoFrameTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
  backgroundImageSrc,
  overlayOpacity = 0.5,
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
        padding: 56,
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
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 34,
          border: "1px solid rgba(255,255,255,0.24)",
          background: "rgba(0,0,0,0.35)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.55)",
          padding: 62,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 22,
              background: accentColor,
              color: "#0b1020",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: 18,
              color: textColor,
              opacity: 0.75,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Framed Cover
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: title.length > 48 ? 58 : 66,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: textColor,
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 980,
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
                opacity: 0.88,
                display: "flex",
                flexWrap: "wrap",
                maxWidth: 940,
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: textColor,
              opacity: 0.75,
              fontSize: 22,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 99, background: accentColor }} />
            <div style={{ display: "flex" }}>og-image.org</div>
          </div>

          <div
            style={{
              width: 160,
              height: 8,
              borderRadius: 99,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoFrameTemplate;
