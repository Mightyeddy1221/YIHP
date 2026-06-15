import { ImageResponse } from "next/og";

export const runtime = "edge";

// Generates a branded 1200x630 social-share card (navy/gold) with the headline.
// Used as the fallback OG image whenever an article/memo has no hero image.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawTitle = searchParams.get("title") || "Policy Research for a Healthier Future";
  const title = rawTitle.length > 110 ? `${rawTitle.slice(0, 110)}…` : rawTitle;
  const kicker = (searchParams.get("kicker") || "Youth Institute for Health Policy").toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f2238 0%, #1B3A5C 100%)",
          padding: "72px 80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              background: "#C8952A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, color: "#0f2238" }}>Y</span>
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2, marginLeft: 20 }}>YIHP</span>
        </div>

        {/* Kicker + headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: 4, color: "#D8A93E" }}>{kicker}</span>
          <div style={{ display: "flex", width: 90, height: 5, background: "#C8952A", marginTop: 24, marginBottom: 28 }} />
          <span style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.14, color: "white" }}>{title}</span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 24, color: "#9fb3c8" }}>youthihp.org</span>
          <span style={{ fontSize: 22, color: "#9fb3c8" }}>Youth Institute for Health Policy</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
