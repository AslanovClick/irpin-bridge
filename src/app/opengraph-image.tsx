import { ImageResponse } from "next/og";
import { LOGO_FULL } from "@/components/ui/logo-paths";

/* Типова OG-картинка для сторінок без власного фото: знак і напис — векторні контури, шрифт не потрібен */
export const alt = "IRPIN BRIDGE — креативна студія та соціальне підприємство з Ірпеня";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const [, , w, h] = LOGO_FULL.viewBox.split(" ").map(Number);
  const logoW = 620;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#111111" }}>
        {/* Кольорові пари бренду — смуга праворуч */}
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 260, display: "flex", flexDirection: "column" }}>
          {["#D5F266", "#4FC6E6", "#EF65AB", "#EADFBB", "#F77E2D"].map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
          <svg width={logoW} height={(logoW * h) / w} viewBox={LOGO_FULL.viewBox}>
            <path d={LOGO_FULL.mark} fill="#D5F266" />
            <path d={LOGO_FULL.word} fill="#F9F9F9" />
            <path d={LOGO_FULL.tagline} fill="#F9F9F9" />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
