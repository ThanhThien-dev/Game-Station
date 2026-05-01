import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Joy Station Gaming Center";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #18181b 50%, #0f0f0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            background: "linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          JOY STATION
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#a1a1aa",
            marginTop: 16,
            fontWeight: 400,
          }}
        >
          Trung Tâm Gaming Cao Cấp
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#22d3ee",
            marginTop: 32,
            display: "flex",
            gap: 32,
          }}
        >
          <span>🎮 Nintendo Switch</span>
          <span>🕹️ PS4</span>
          <span>🎯 Xbox 360</span>
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#71717a",
            marginTop: 24,
          }}
        >
          64/10 Võ Oanh, P.25, Bình Thạnh, TP.HCM
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}