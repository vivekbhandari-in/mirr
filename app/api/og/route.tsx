import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || "landing";
  const title = searchParams.get("title") || "Become who you said you'd be.";
  const subtitle =
    searchParams.get("subtitle") ||
    "Understand what's holding you back. Build better habits. Make progress, one day at a time.";
  const streak = searchParams.get("streak");
  const area = searchParams.get("area") || "Career & discipline";

  if (type === "streak" && streak) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#13110F",
            color: "#F5F0E8",
            fontFamily: "Georgia, serif",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "18px",
              color: "#C9A96E",
              marginBottom: "24px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Mirr · Milestone Achieved
          </div>
          <div
            style={{
              fontSize: "120px",
              fontStyle: "italic",
              color: "#C9A96E",
              lineHeight: 1,
              marginBottom: "16px",
            }}
          >
            {streak}
          </div>
          <div
            style={{
              fontSize: "36px",
              fontStyle: "italic",
              color: "#F5F0E8",
              marginBottom: "16px",
            }}
          >
            Days of showing up for myself
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#9E958A",
              fontFamily: "sans-serif",
            }}
          >
            Focus: {area} · mirr.app
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default card / mirror summary
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#13110F",
          color: "#F5F0E8",
          padding: "60px",
          border: "12px solid #2A2520",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "32px", fontFamily: "Georgia, serif", color: "#F5F0E8" }}>
            Mirr<span style={{ color: "#C9A96E" }}>.</span>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#C9A96E",
              backgroundColor: "rgba(201,169,110,0.12)",
              padding: "6px 14px",
              borderRadius: "4px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontFamily: "sans-serif",
            }}
          >
            {area}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "56px",
              fontFamily: "Georgia, serif",
              lineHeight: 1.1,
              color: "#F5F0E8",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#9E958A",
              fontFamily: "sans-serif",
              lineHeight: 1.5,
              maxWidth: "800px",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(201,169,110,0.2)",
            paddingTop: "24px",
            fontFamily: "sans-serif",
            fontSize: "16px",
            color: "#6B6259",
          }}
        >
          <div>Build your personal mirror at mirr.app</div>
          <div style={{ color: "#C9A96E" }}>Free for 30 days · No card needed</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

