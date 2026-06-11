import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/constants";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: "14px",
          fontWeight: 800,
          borderRadius: "8px",
        }}
        aria-label={APP_NAME}
      >
        NG
      </div>
    ),
    { ...size },
  );
}
