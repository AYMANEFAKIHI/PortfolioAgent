import { ImageResponse } from "next/og";
import { profile, seo } from "@/lib/data";

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, background: "#09090b", color: "#fff",
          backgroundImage: "radial-gradient(circle at 85% 100%, rgba(255,59,47,0.55), rgba(9,9,11,0) 55%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#a1a1aa" }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 12, background: "#ff3b2f", color: "#09090b", fontSize: 30, fontWeight: 900, alignItems: "center", justifyContent: "center" }}>AF</div>
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 900, lineHeight: 0.95, letterSpacing: -4, textTransform: "uppercase" }}>{profile.name}</div>
          <div style={{ marginTop: 24, fontSize: 38, color: "#ff3b2f", fontWeight: 700 }}>{profile.role}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a1a1aa" }}>
          <span>{profile.city}</span>
          <span>Next.js · Node.js · AWS</span>
        </div>
      </div>
    ),
    size
  );
}
