// Vitest global setup for the light-theme-industrial-redesign feature.
// Registers @testing-library/jest-dom matchers, polyfills matchMedia,
// and provides minimal mocks for IntersectionObserver and ResizeObserver
// so component tests can run in the jsdom environment.

import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// matchMedia polyfill — jsdom does not implement window.matchMedia.
// Defaults every query to no-match; individual tests override via vi.spyOn.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// IntersectionObserver mock — jsdom does not implement it.
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
if (
  typeof window !== "undefined" &&
  typeof window.IntersectionObserver === "undefined"
) {
  window.IntersectionObserver = MockIntersectionObserver;
}

// ResizeObserver mock — jsdom does not implement it.
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = MockResizeObserver;
}
if (
  typeof window !== "undefined" &&
  typeof window.ResizeObserver === "undefined"
) {
  window.ResizeObserver = MockResizeObserver;
}

// Expose vi globally for ergonomics; vitest already exposes it under globals: true.
export { vi };
