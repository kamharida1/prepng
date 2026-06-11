import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${APP_NAME} — JAMB, WAEC, NECO & POST-UTME past questions practice`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #14532d 0%, #15803d 45%, #22c55e 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "20px",
              background: "#ffffff",
              color: "#15803d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 800,
            }}
          >
            NG
          </div>
          <div style={{ fontSize: "56px", fontWeight: 800 }}>{APP_NAME}</div>
        </div>
        <div style={{ fontSize: "44px", fontWeight: 700, lineHeight: 1.2, maxWidth: "900px" }}>
          JAMB, WAEC, NECO & POST-UTME Past Questions
        </div>
        <div style={{ marginTop: "24px", fontSize: "28px", opacity: 0.92, maxWidth: "860px" }}>
          CBT practice · detailed explanations · offline packs · built for Nigerian students
        </div>
        <div style={{ marginTop: "48px", fontSize: "24px", opacity: 0.85 }}>prepng.com</div>
      </div>
    ),
    { ...size },
  );
}
