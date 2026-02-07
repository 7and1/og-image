import type { TemplateProps } from "../types";

export function PhotoSplitTemplate({
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
        display: "flex",
        fontFamily: "Inter",
        background: backgroundColor,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
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
            background: `linear-gradient(90deg, rgba(0,0,0,${overlay}) 0%, rgba(0,0,0,${overlay * 0.25}) 70%, rgba(0,0,0,0) 100%)`,
          }}
        />
      </div>

      <div
        style={{
          width: 470,
          background: "rgba(5,10,20,0.92)",
          borderLeft: "1px solid rgba(255,255,255,0.12)",
          padding: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: accentColor,
                color: "#07101d",
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
                width: 96,
                height: 8,
                borderRadius: 99,
                background: accentColor,
                opacity: 0.9,
              }}
            />
          </div>

          <div
            style={{
              fontSize: title.length > 46 ? 54 : 60,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
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
                fontSize: 26,
                lineHeight: 1.4,
                color: textColor,
                opacity: 0.88,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontSize: 18,
              color: textColor,
              opacity: 0.7,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Photo Split Layout
          </div>
          <div
            style={{
              width: 180,
              height: 6,
              borderRadius: 99,
              background: accentColor,
              opacity: 0.55,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoSplitTemplate;
