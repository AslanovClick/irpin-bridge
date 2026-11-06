import { LOGO_COMPACT, LOGO_FULL, LOGO_MARK } from "./logo-paths";

type LogoProps = {
  /** full — з підписом «Art Center» (від ~200px ширини), compact — без підпису, mark — тільки знак */
  variant?: "full" | "compact" | "mark";
  className?: string;
  title?: string;
};

/** Логотип IRPIN BRIDGE. Колір — з CSS `color` (currentColor). */
export function Logo({ variant = "compact", className, title = "IRPIN BRIDGE" }: LogoProps) {
  const src: { viewBox: string; mark: string; word?: string; tagline?: string } =
    variant === "full" ? LOGO_FULL : variant === "compact" ? LOGO_COMPACT : LOGO_MARK;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={src.viewBox}
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      focusable="false"
    >
      {/* Прямокутники знака — без згладжування, щоб грані були рівними на малих розмірах */}
      <path fill="currentColor" d={src.mark} shapeRendering="crispEdges" />
      {src.word && <path fill="currentColor" d={src.word} />}
      {src.tagline && <path fill="currentColor" d={src.tagline} />}
    </svg>
  );
}
