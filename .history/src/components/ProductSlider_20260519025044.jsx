import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ProductCard } from "./ProductCard";
import { durations, easings } from "../animation/motion";
import { useReducedMotionContext } from "../animation/MotionConfig";

/**
 * ProductSlider — Horizontal carousel for the ProductCard family.
 *
 * Animates the card-to-card transition with Framer Motion using
 * `durations.productSliderMs` (320 ms ∈ [200, 450]) so the slider
 * resolves Req 13.6 and reads its timing from the canonical preset
 * module shared with the rest of the Motion_Layer.
 *
 * The parent passes a list of `{ product, visual }` entries; navigation
 * controls (prev / next / dot) cycle the active index, and a
 * `<motion.div>` keyed by the index drives the horizontal slide.
 *
 * When `reducedMotion` is true, the transition collapses to an instant
 * swap (Req 13.10): we keep the AnimatePresence machinery wired up but
 * zero the duration so the destination card renders immediately.
 *
 * @param {{
 *   items: Array<{ product: object, visual: 'defect' | 'dataflow' }>,
 *   initialIndex?: number,
 * }} props
 */
export function ProductSlider({ items, initialIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const { reducedMotion } = useReducedMotionContext();

  if (!items || items.length === 0) return null;

  const total = items.length;
  const goTo = (next) => {
    const normalized = ((next % total) + total) % total;
    setDirection(normalized > activeIndex ? 1 : -1);
    setActiveIndex(normalized);
  };

  const transitionDurationS = reducedMotion
    ? 0
    : durations.productSliderMs / 1000;
  const slideDistance = reducedMotion ? 0 : 60;

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? slideDistance : -slideDistance,
      opacity: reducedMotion ? 1 : 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: dir > 0 ? -slideDistance : slideDistance,
      opacity: reducedMotion ? 1 : 0,
    }),
  };

  const active = items[activeIndex];

  return (
    <div className="relative w-full">
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: transitionDurationS,
              ease: easings.standard,
            }}
            className="w-full"
          >
            <ProductCard
              product={active.product}
              visual={active.visual}
              index={activeIndex}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-txt-secondary hover:text-txt-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            aria-label="Previous product"
          >
            ← Prev
          </button>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Product slides"
          >
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to product ${i + 1}`}
                onClick={() => goTo(i)}
                className="w-2 h-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                style={{
                  background:
                    i === activeIndex
                      ? "var(--telemetry-primary)"
                      : "var(--border-default)",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-txt-secondary hover:text-txt-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            aria-label="Next product"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
