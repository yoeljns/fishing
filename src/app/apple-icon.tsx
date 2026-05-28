import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#99f6e4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <path
            d="M8 32 C 16 14, 38 14, 46 28 L 58 18 L 54 32 L 58 46 L 46 36 C 38 50, 16 50, 8 32 Z"
            fill="url(#g)"
          />
          <circle cx="18" cy="28" r="2.4" fill="white" />
          <path
            d="M30 32 q 4 -4 10 -4"
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
