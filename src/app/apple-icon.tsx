import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/constants";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#15803d",
          color: "#ffffff",
          fontSize: "64px",
          fontWeight: 800,
          borderRadius: "36px",
        }}
        aria-label={APP_NAME}
      >
        NG
      </div>
    ),
    { ...size },
  );
}
