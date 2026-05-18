// Unit tests for src/hooks/useSectionReveal.js (Reqs 9.1–9.6, 18.3, Property 10).
//
// Verifies:
//   - reduced-motion path snaps targets to the final state and creates no
//     ScrollTrigger (Req 9.6).
//   - the no-targets path (missing heading/subheading/items) does not throw
//     and creates no ScrollTrigger (Req 9.5).
//   - the FeatureGrid stagger window stays at or below 1500 ms — i.e. the
//     internal effective-stagger helper enforces Property 10 (Req 9.4).
//
// Builds tests around a thin wrapper component that drives the hook via a
// real React render so the effect cleanup also runs.

import { useRef } from "react";
import { render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the GSAP wrapper module so we can observe calls without exercising
// the real ScrollTrigger plugin (which the test setup would otherwise need
// to register against jsdom).
vi.mock("../../animation/gsap", () => {
  const set = vi.fn();
  const to = vi.fn().mockReturnThis();
  const timeline = vi.fn(() => ({ to }));
  const create = vi.fn(() => ({ kill: vi.fn() }));
  return {
    gsap: { set, timeline, killTweensOf: vi.fn(), getTweensOf: () => [] },
    ScrollTrigger: { create, getAll: () => [] },
  };
});

vi.mock("../../animation/MotionConfig", () => ({
  useReducedMotionContext: () => ({
    reducedMotion: globalThis.__REDUCED_MOTION__ === true,
    detectionFailed: false,
  }),
}));

import { gsap, ScrollTrigger } from "../../animation/gsap";
import { useSectionReveal } from "../../hooks/useSectionReveal";

function Section({ children, options }) {
  const ref = useRef(null);
  useSectionReveal(ref, options);
  return <section ref={ref}>{children}</section>;
}

beforeEach(() => {
  globalThis.__REDUCED_MOTION__ = false;
  gsap.set.mockClear();
  gsap.timeline.mockClear();
  ScrollTrigger.create.mockClear();
});

afterEach(() => {
  cleanup();
});

describe("useSectionReveal", () => {
  it("snaps targets to the final state and skips ScrollTrigger when reduced motion is active (Req 9.6)", () => {
    globalThis.__REDUCED_MOTION__ = true;

    render(
      <Section>
        <h2>Title</h2>
        <p data-subheading>Sub</p>
        <div data-reveal-item>1</div>
        <div data-reveal-item>2</div>
      </Section>,
    );

    expect(ScrollTrigger.create).not.toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalledTimes(1);
    const [targets, vars] = gsap.set.mock.calls[0];
    expect(targets).toHaveLength(4);
    expect(vars).toMatchObject({
      opacity: 1,
      y: 0,
      clearProps: "transform,opacity",
    });
  });

  it("is a no-op when no targets are present (Req 9.5)", () => {
    render(
      <Section>
        <p>No heading, no subheading, no items.</p>
      </Section>,
    );

    expect(ScrollTrigger.create).not.toHaveBeenCalled();
    expect(gsap.set).not.toHaveBeenCalled();
  });

  it("clamps the per-item stagger so the total window never exceeds 1500 ms (Req 9.4 / Property 10)", () => {
    // 30 items at the upper-bound 120 ms would otherwise produce a 3480 ms
    // window; the hook must compress it to ≤ 1500 ms.
    const N = 30;
    const items = Array.from({ length: N }, (_, i) => (
      <div key={i} data-reveal-item>
        {i}
      </div>
    ));

    render(
      <Section options={{ stagger: 120 }}>
        <h2>Title</h2>
        {items}
      </Section>,
    );

    expect(ScrollTrigger.create).toHaveBeenCalledTimes(1);
    const config = ScrollTrigger.create.mock.calls[0][0];
    expect(typeof config.onEnter).toBe("function");

    // Drive the onEnter so the timeline's `.to(items, { stagger })` is invoked.
    const tl = { to: vi.fn().mockReturnThis() };
    gsap.timeline.mockReturnValueOnce(tl);
    config.onEnter();

    // Find the items-stagger call (the call whose first arg is the items array).
    const itemsCall = tl.to.mock.calls.find(
      ([targets]) => Array.isArray(targets) && targets.length === N,
    );
    expect(
      itemsCall,
      "expected a tl.to call for the items array",
    ).toBeDefined();
    const staggerSeconds = itemsCall[1].stagger;
    const totalWindowMs = staggerSeconds * 1000 * (N - 1);

    expect(totalWindowMs).toBeLessThanOrEqual(1500);
    // And the stagger itself stays within the documented per-item bounds.
    expect(staggerSeconds * 1000).toBeGreaterThanOrEqual(40);
    expect(staggerSeconds * 1000).toBeLessThanOrEqual(120);
  });
});
