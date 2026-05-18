/**
 * Logo — Reusable Tvastr brand logo component.
 *
 * Renders the crossed forge hammer + axe mark alongside the TVASTR wordmark.
 *
 * Props:
 *   size    — 'sm' | 'md' | 'lg'  (default: 'sm')
 *   showText — whether to show the TVASTR wordmark (default: true)
 */
export function Logo({ size = "sm", showText = true }) {
  const imgSizes = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* Forge mark — crossed hammer & axe */}
      <img
        src="/logo.png"
        alt="Tvastr forge mark"
        className={`${imgSizes[size]} object-contain flex-shrink-0`}
      />

      {showText && (
        <span
          className={`${textSizes[size]} font-black tracking-[0.2em] uppercase text-txt-primary`}
        >
          TVASTR
        </span>
      )}
    </div>
  );
}
