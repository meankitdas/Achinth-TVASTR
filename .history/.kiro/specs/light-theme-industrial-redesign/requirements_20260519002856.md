# Requirements Document

## Introduction

This feature redesigns the Tvastr marketing site and customer portal from the current dark industrial aesthetic to a light industrial aesthetic, while introducing a coordinated animation system (GSAP for scroll-linked and hero choreography; Framer Motion for component-level transitions and gestures) and reconciling the new visual language with the existing centralized design-token system in `src/design/`. The redesign adopts component primitives and brand tokens scaffolded by `npx getdesign@latest add cohere`, mapped onto the existing `colors.js` token contract so the Python Tkinter Theme Editor and Tailwind config continue to function without breaking changes. The result is a light-themed surface that still reads as industrial (exposed grid, blueprint guides, monospace technical readouts, machined corners) and that introduces subtle, personal micro-interactions (cursor cues, magnetic CTAs, ambient idle motion, scroll-linked reveals) without compromising performance, accessibility, tier-gating semantics, or reduced-motion compliance.

## Glossary

- **Tvastr_Site**: The combined React + Vite application served from `src/`, including the public marketing pages and the authenticated `/portal` routes.
- **Light_Theme**: The new default color scheme that replaces the current dark scheme as the application's only theme upon completion of this feature.
- **Token_System**: The set of files under `src/design/` (`colors.js`, `typography.js`, `spacing.js`, `shadows.js`, `gradients.js`, `index.js`) plus the CSS variables in `src/index.css` and the import map in `tailwind.config.js`.
- **Cohere_Kit**: The set of component primitives, brand colors, and design tokens produced when running `npx getdesign@latest add cohere` in the workspace.
- **Brand_Color**: The primary accent color sourced from Cohere_Kit and surfaced as `colors.telemetry.primary` in `src/design/colors.js`.
- **Theme_Editor**: The Python Tkinter desktop application at `tools/theme_editor.py` that parses and rewrites hex values in `src/design/colors.js`.
- **GSAP_Layer**: The animation subsystem implemented using the GSAP library and its ScrollTrigger plugin, used for scroll-linked timelines, hero choreography, and section-spanning sequences.
- **Motion_Layer**: The animation subsystem implemented using the Framer Motion library, used for component-level enter/exit transitions, layout animations, gesture responses, and page transitions.
- **Industrial_Decor**: The set of light-theme visual motifs comprising fixed background grid lines, blueprint corner guides, monospace technical readouts, machined (clipped/notched) corners, and ruler-tick separators.
- **Forge_Core**: The existing Three.js icosahedron rendered in the hero via `src/three/ForgeCore.jsx` (and `FloatingGeometry.jsx`).
- **Tier_Badge**: The state badge rendered on portal product cards indicating one of `ACTIVE`, `INCLUDED`, or `LOCKED` based on the current license tier.
- **Locked_State**: The visual and behavioral state shown for features the current user's tier does not grant access to, rendered by `LockedProductCard`, `LockedFeatureBlock`, and `LockedScreen`.
- **Reduced_Motion**: The user preference detected by the `prefers-reduced-motion: reduce` media query.
- **Contrast_Ratio**: The WCAG 2.1 luminance contrast ratio between a foreground and background color.
- **Theme_Token**: A named entry inside the `colors` or `semantic` exports of `src/design/colors.js` (e.g., `colors.text.primary`, `semantic.brand`).
- **Animation_Frame_Budget**: The maximum permitted main-thread time consumed by animation work per frame on the desktop reference device.
- **Desktop_Reference_Device**: A device with at least 4 physical CPU cores at 2.4 GHz or higher, at least 8 GB RAM, a 1920x1080 display at 60 Hz, the latest stable Chromium-based browser, a warm cache, and a 50 Mbps or faster network connection.

## Requirements

### Requirement 1: Adopt Cohere brand kit and reconcile with the existing token system

**User Story:** As a designer maintaining Tvastr's visual identity, I want the Cohere_Kit's brand assets and component primitives to drive the redesign while still flowing through `src/design/colors.js`, so that the Theme_Editor, Tailwind utilities, and CSS variables continue to resolve consistently.

#### Acceptance Criteria

1. THE Tvastr_Site SHALL execute `npx getdesign@latest add cohere` once during this feature's implementation and commit the resulting Cohere_Kit artifacts under a single directory at `src/design/cohere_kit/`.
2. THE Tvastr_Site SHALL map the Cohere_Kit primary Brand_Color, expressed as a 6-digit hex code, to `colors.telemetry.primary` in `src/design/colors.js`.
3. THE Tvastr_Site SHALL preserve the six existing top-level keys in the `colors` export of `src/design/colors.js` (`background`, `text`, `telemetry`, `process`, `signal`, `border`) and SHALL preserve the three keys of the `semantic` export (`brand`, `alert`, `danger`).
4. WHEN the Theme_Editor parses `src/design/colors.js` after the redesign, THE Theme_Editor SHALL read every Theme_Token whose value is a 6-digit hex code, return it as an editable entry in the token list, and complete parsing without raising a parse error.
5. IF `src/design/colors.js` contains a Theme_Token value that is not a 6-digit hex code, THEN THE Theme_Editor SHALL skip that token, continue parsing the remaining tokens, and surface an error indication identifying the rejected token by its key path.
6. WHEN the Theme_Editor saves a 6-digit hex value to any Theme_Token, THE Tvastr_Site SHALL resolve that updated value through both the corresponding Tailwind utility class and the corresponding CSS variable on the next development build started after the save.
7. THE Tvastr_Site SHALL document, under `src/design/`, the mapping from each Cohere_Kit token to its Theme_Token destination in `src/design/colors.js`, including the source token name, the destination key path, and the 6-digit hex value.

### Requirement 2: Establish the Light_Theme color system

**User Story:** As a visitor, I want the site to present a coherent light industrial color palette, so that the brand reads as precise and modern in daylight viewing conditions.

#### Acceptance Criteria

1. THE Tvastr_Site SHALL set `colors.background.primary` to a 6-digit hex value (format `#RRGGBB`) whose CIE relative luminance is between 0.85 and 1.0 inclusive.
2. THE Tvastr_Site SHALL set `colors.text.primary` to a 6-digit hex value (format `#RRGGBB`) that achieves a Contrast_Ratio of at least 7.0 against `colors.background.primary`.
3. THE Tvastr_Site SHALL set `colors.text.secondary` to a 6-digit hex value (format `#RRGGBB`) that achieves a Contrast_Ratio of at least 4.5 against `colors.background.primary`.
4. THE Tvastr_Site SHALL set `colors.text.muted` to a 6-digit hex value (format `#RRGGBB`) that achieves a Contrast_Ratio of at least 3.0 against `colors.background.primary`, and SHALL apply this token only to text rendered at 18.66 px bold or 24 px regular or larger.
5. WHERE `colors.telemetry.primary` is rendered as text smaller than 24 px regular or smaller than 18.66 px bold, or as any interactive label, THE Tvastr_Site SHALL set `colors.telemetry.primary` to a 6-digit hex value (format `#RRGGBB`) that achieves a Contrast_Ratio of at least 4.5 against `colors.background.primary`.
6. WHERE `colors.signal.warning` or `colors.signal.danger` is rendered as a non-text graphical indicator (icon stroke, icon fill, or border accent of at least 1 px width), THE Tvastr_Site SHALL set the token to a 6-digit hex value (format `#RRGGBB`) that achieves a Contrast_Ratio of at least 3.0 against `colors.background.primary`.
7. THE Tvastr_Site SHALL define `colors.border.subtle`, `colors.border.default`, and `colors.border.strong` as `rgba()` values whose alpha components are within the range 0.0 to 1.0 inclusive and satisfy alpha(subtle) < alpha(default) < alpha(strong).
8. THE Tvastr_Site SHALL update the CSS custom properties in `src/index.css` such that, for every Theme_Token defined in `src/design/colors.js`, exactly one corresponding `--*` CSS variable resolves to the identical hex or rgba value at runtime.
9. IF a Theme_Token in `src/design/colors.js` has no corresponding `--*` CSS variable in `src/index.css`, OR any `--*` CSS variable resolves to a value that differs from its Theme_Token, THEN THE Tvastr_Site SHALL surface a theme integrity error indicating the mismatched token name and SHALL NOT render the affected component with an unmapped color.

### Requirement 3: Remove dark-theme defaults

**User Story:** As an engineer maintaining the codebase, I want the dark-theme styling removed so that there is exactly one source of truth for theme colors and no orphaned dark-mode classes.

#### Acceptance Criteria

1. THE Tvastr_Site SHALL render Light_Theme as the only theme served at runtime after the redesign is shipped, and SHALL NOT expose any theme-switching mechanism (toggle control, keyboard shortcut, persisted preference, or runtime API).
2. THE Tvastr_Site SHALL contain zero occurrences of the Tailwind `dark:` variant prefix in any committed file under `src/` with extension `.jsx`, `.js`, `.ts`, `.tsx`, `.css`, or `.html`, verifiable by a repository-wide text search returning zero matches.
3. WHERE the operating system reports a `prefers-color-scheme: dark` preference, THE Tvastr_Site SHALL render the same Light_Theme tokens used when no preference is reported, producing pixel-identical output for every page.
4. THE Tvastr_Site SHALL replace each previously-dark hex value in `src/design/colors.js` with its Light_Theme replacement in place, and SHALL preserve the total count of Theme_Tokens, the six top-level `colors` keys, the three `semantic` keys, and every nested key name unchanged before and after the replacement.
5. IF the build pipeline detects any `dark:` prefix or theme-switching reference in committed source under `src/`, THEN THE build SHALL fail with an error that identifies the offending file path and line number.

### Requirement 4: Install and isolate the animation libraries

**User Story:** As an engineer building the new motion system, I want GSAP and Framer Motion installed with clear roles, so that animation work is consistent and tree-shakable.

#### Acceptance Criteria

1. THE Tvastr_Site SHALL declare `gsap` and `framer-motion` as production dependencies in `package.json` with exact pinned versions (no `^` or `~` range prefixes), and SHALL record matching resolved versions in the project lockfile such that a clean install reproduces the same dependency tree.
2. WHEN the Tvastr_Site bootstraps, THE GSAP_Layer SHALL register the GSAP ScrollTrigger plugin exactly once, and SHALL NOT re-register the plugin on subsequent route changes, component re-renders, or hot-module replacement events.
3. IF the GSAP ScrollTrigger plugin registration fails, THEN THE Tvastr_Site SHALL surface a runtime error identifying the failure, SHALL NOT initialize any scroll-linked timelines, and SHALL render every section in its final visual state.
4. THE GSAP_Layer SHALL be the only animation layer used for scroll-position-driven timelines whose trigger or scrubbed range covers two or more distinct sibling sections within the same scroll container.
5. THE Motion_Layer SHALL be the only animation layer used for component mount transitions, component unmount transitions, layout animations, and pointer-, hover-, or tap-gesture responses, and SHALL NOT drive scroll-linked timelines.
6. WHERE a single visual effect requires both a scroll trigger and a gesture response, THE Tvastr_Site SHALL drive the scroll portion with the GSAP_Layer and the gesture portion with the Motion_Layer, and SHALL ensure that no single CSS property on a given element is written by both layers within the same animation frame.
7. THE Tvastr_Site SHALL increase the gzipped production JS bundle, measured by the project's existing build tool against the same set of entry points before and after adding `gsap` and `framer-motion`, by no more than 90 KB combined.

### Requirement 5: Honor the Reduced_Motion preference

**User Story:** As a user with motion sensitivity, I want non-essential motion to be disabled when I have requested reduced motion, so that the site is comfortable to use.

#### Acceptance Criteria

1. WHILE Reduced_Motion is active, THE GSAP_Layer SHALL set the duration of every non-essential timeline to 0 milliseconds and SHALL apply only the timeline's final state.
2. WHILE Reduced_Motion is active, THE Motion_Layer SHALL disable enter, exit, and idle animations and SHALL render every component in its final visual state.
3. WHILE Reduced_Motion is active, THE Tvastr_Site SHALL execute focus-visible and active-state transitions whose total duration is less than or equal to 150 milliseconds, and SHALL NOT execute any other transition whose duration exceeds 150 milliseconds.
4. WHILE Reduced_Motion is active, THE Forge_Core SHALL render a defined final-pose static frame and SHALL NOT advance its rotation animation.
5. WHILE Reduced_Motion is active, THE Tvastr_Site SHALL NOT render any continuous ambient particle motion.
6. WHEN the user toggles the Reduced_Motion preference at the operating-system level, THE Tvastr_Site SHALL apply the new preference to currently-mounted components within 500 milliseconds of receiving the preference change event, and SHALL apply the new preference to every newly-mounted component thereafter.
7. WHEN the Tvastr_Site mounts on initial page load, THE Tvastr_Site SHALL evaluate the Reduced_Motion preference before the first animation frame is scheduled.
8. IF the Tvastr_Site cannot detect the Reduced_Motion preference, THEN THE Tvastr_Site SHALL behave as if Reduced_Motion is active and SHALL surface a non-blocking indication that the preference could not be detected.

### Requirement 6: Adopt the Industrial_Decor visual language in Light_Theme

**User Story:** As a visitor, I want the site to feel like an industrial blueprint even in light mode, so that Tvastr's positioning as an industrial AI company is unmistakable.

#### Acceptance Criteria

1. THE Tvastr_Site SHALL render a fixed background grid layer covering the full viewport behind all page content, composed of 1-pixel lines spaced 32 pixels apart on both axes, drawn from `colors.border.subtle`.
2. WHERE the current route's path matches `/`, `/technology`, `/about`, or `/research`, THE Tvastr_Site SHALL render four blueprint corner guides at the top-left, top-right, bottom-left, and bottom-right of the viewport, each composed of two perpendicular line segments between 24 and 48 pixels in length, offset between 12 and 24 pixels from the viewport edge, with a 1-pixel stroke sourced from `colors.border.default`.
3. IF the current route's path does not match `/`, `/technology`, `/about`, or `/research`, THEN THE Tvastr_Site SHALL NOT render blueprint corner guides.
4. THE Tvastr_Site SHALL render section eyebrows, version strings, checksums, and coordinate readouts using a typeface in which every glyph occupies the same horizontal advance width.
5. THE Tvastr_Site SHALL apply a machined-corner clip (notched or 45-degree chamfered) of length between 8 and 16 pixels to at least one corner of every rendered instance of `ProductCard`, `LockedProductCard`, `ProductDownloadCard`, `RollbackVersionCard`, and `UpgradeBanner`.
6. THE Tvastr_Site SHALL render section dividers as ruler-tick lines composed of marks between 4 and 8 pixels in length, spaced between 8 and 16 pixels apart, using `colors.border.default`.
7. THE Industrial_Decor layer SHALL be rendered behind interactive content such that pointer events on any element of the Industrial_Decor layer pass through to the underlying interactive element without being intercepted.

### Requirement 7: Adapt the Forge_Core for Light_Theme

**User Story:** As a visitor on the home hero, I want the existing Three.js forge core to remain visually present and on-brand against a light background, so that the hero retains its signature.

#### Acceptance Criteria

1. THE Forge_Core SHALL render against the Light_Theme background while maintaining a Contrast_Ratio of at least 1.4 between any sampled silhouette edge pixel and `colors.background.primary` at every rendered frame.
2. THE Forge_Core SHALL source its primary emissive accent color from `semantic.brand`.
3. WHILE the viewport width is less than 768 pixels, THE Forge_Core SHALL render at a pixel ratio not greater than 1.5.
4. WHILE the Forge_Core is running on a Desktop_Reference_Device with no other tab-blocking work active, THE Forge_Core SHALL maintain an average frame rate of at least 50 frames per second measured over any rolling 5-second window.
5. WHILE the hero section's bounding rectangle is fully outside the viewport, THE Forge_Core SHALL pause its render loop.
6. WHEN the hero section's bounding rectangle re-enters the viewport after being fully outside, THE Forge_Core SHALL resume its render loop within 200 milliseconds.
7. IF the Forge_Core fails to initialize its rendering context or loses it during runtime, THEN THE Forge_Core SHALL display a static fallback visual using `semantic.brand` against `colors.background.primary` without preventing the remainder of the hero section from rendering.

### Requirement 8: Choreograph the Hero on entry and on scroll

**User Story:** As a visitor landing on the home page, I want the hero to assemble with deliberate, smooth motion and respond to my scroll, so that the first impression communicates precision.

#### Acceptance Criteria

1. WHEN the home page mounts, THE GSAP_Layer SHALL run an entry timeline that reveals the wordmark, then the tagline, then the primary CTA, and finally the Forge_Core in that sequential order, with a total timeline duration between 800 and 1600 milliseconds inclusive, and with each element transitioning from opacity 0 to opacity 1 and reaching its final position by the timeline's end.
2. WHILE the user scrolls within the hero section, THE GSAP_Layer SHALL drive a scroll-linked parallax on the Forge_Core whose vertical translation magnitude scales linearly with scroll progress from 0 pixels at the hero's top boundary to a maximum of 120 pixels at the hero's exit boundary, and SHALL update the translation within 16 milliseconds of each scroll event.
3. WHILE the hero entry timeline is active, THE Tvastr_Site SHALL keep the primary CTA button and all navbar links responsive to pointer click and keyboard activation (Enter and Space keys) within 100 milliseconds of input, and SHALL NOT block focus traversal via the Tab key.
4. IF the hero entry timeline is interrupted by route navigation before completion, THEN THE GSAP_Layer SHALL kill the active timeline, release all timeline and ScrollTrigger references, and complete cleanup before the next page mounts, leaving no animation callbacks scheduled.
5. IF Reduced_Motion is active, THEN THE GSAP_Layer SHALL skip the entry timeline animation and the scroll-linked parallax, and SHALL render the wordmark, tagline, primary CTA, and Forge_Core in their final positions with opacity 1 immediately on mount.

### Requirement 9: Provide scroll-linked reveals for every section

**User Story:** As a visitor scrolling the home and technology pages, I want sections to reveal smoothly as they enter the viewport, so that the page feels alive without being distracting.

#### Acceptance Criteria

1. WHEN any section in `src/components/sections/` first attains at least 15 percent of its bounding-box area within the viewport, THE GSAP_Layer SHALL animate the section's primary heading and subheading from opacity 0 and a vertical offset between 16 and 48 pixels to opacity 1 and zero offset over a duration between 400 and 900 milliseconds inclusive.
2. THE GSAP_Layer SHALL trigger each section instance's reveal exactly once per page lifetime, and SHALL ignore subsequent viewport-entry events for the same section instance.
3. WHEN a section's reveal animation completion callback fires, THE GSAP_Layer SHALL clear the inline transform and opacity styles from the section's primary heading and subheading within 50 milliseconds.
4. WHERE a section contains a `FeatureGrid` primitive, THE GSAP_Layer SHALL stagger the reveal of its grid items with an inter-item delay between 40 and 120 milliseconds inclusive, and SHALL ensure the total stagger window for the grid does not exceed 1500 milliseconds.
5. IF a section's primary heading or subheading element is missing from the DOM at reveal time, THEN THE GSAP_Layer SHALL skip the missing element's animation, proceed with the present elements, and leave the missing element's parent DOM untouched.
6. IF Reduced_Motion is active, THEN THE GSAP_Layer SHALL render every section's primary heading, subheading, and grid items in their final visible state without fade, translate, or stagger animations.

### Requirement 10: Provide page transitions via the Motion_Layer

**User Story:** As a visitor navigating between routes, I want a brief, consistent transition between pages, so that navigation feels intentional.

#### Acceptance Criteria

1. WHEN the route changes between any two routes registered in `App.jsx`, THE Motion_Layer SHALL animate the outgoing page out and the incoming page in with a combined duration between 200 and 500 milliseconds inclusive.
2. WHEN a route change completes, THE Motion_Layer SHALL preserve scroll position behavior consistent with React Router's existing default such that the new page's scroll position is restored within 50 milliseconds of the incoming page mount.
3. IF a page transition is in progress when a new route change is requested, THEN THE Motion_Layer SHALL cancel the in-progress transition within 50 milliseconds and start the new transition from the current visual state.
4. IF a page transition does not complete within 1000 milliseconds, THEN THE Motion_Layer SHALL render the destination page in its final visual state and SHALL log a single warning to the console identifying the source and destination routes.
5. IF Reduced_Motion is active, THEN THE Motion_Layer SHALL render the destination page in its final visual state immediately on route change without enter or exit animation.

### Requirement 11: Provide subtle micro-interactions

**User Story:** As a visitor, I want small responsive cues from the interface, so that the site feels personal and crafted without being noisy.

#### Acceptance Criteria

1. WHEN the pointer hovers over a primary CTA button, THE Motion_Layer SHALL apply a magnetic translation toward the cursor whose magnitude does not exceed 8 pixels in either axis.
2. WHEN the pointer leaves a magnetic element, THE Motion_Layer SHALL spring the element back to its origin within 250 milliseconds.
3. THE Tvastr_Site SHALL render a cursor follower whose maximum radius is 24 pixels and whose visible opacity is between 0.20 and 0.35 inclusive.
4. WHEN the pointer is idle for at least 2 seconds, THE Motion_Layer SHALL fade the cursor follower from its visible opacity to 0 over a duration between 200 and 600 milliseconds.
5. WHEN the pointer moves after the cursor follower has faded to 0, THE Motion_Layer SHALL re-fade the cursor follower to its visible opacity within 200 milliseconds.
6. WHILE no pointer-move, scroll, key, or touch event has occurred for at least 8 seconds, THE GSAP_Layer SHALL drive an ambient idle pulse on the Forge_Core whose scale variation is between 0.98 and 1.02 inclusive and whose period is between 2 and 4 seconds inclusive.
7. WHERE a device reports `(pointer: coarse)`, THE Tvastr_Site SHALL NOT render the cursor follower.
8. WHERE a device reports `(pointer: coarse)`, THE Tvastr_Site SHALL NOT apply the magnetic hover effect to any primary CTA button.
9. IF Reduced_Motion is active, THEN THE Tvastr_Site SHALL NOT apply magnetic translation, cursor follower fade, or ambient idle pulse.

### Requirement 12: Style and animate the Navbar

**User Story:** As a visitor, I want the top navigation to feel anchored and responsive as I scroll, so that I always know where I am.

#### Acceptance Criteria

1. WHILE the document scroll offset is less than 16 pixels, THE Navbar SHALL render with a background color whose alpha equals 0 and SHALL NOT render a bottom border.
2. WHILE the document scroll offset is greater than or equal to 16 pixels, THE Navbar SHALL render with a background color sourced from `colors.background.primary` at an alpha between 0.85 and 0.95 inclusive and a 1-pixel bottom border sourced from `colors.border.subtle`.
3. WHEN a navigation link receives keyboard focus, THE Tvastr_Site SHALL render a focus ring at least 2 pixels thick whose Contrast_Ratio against `colors.background.primary` is at least 3.0.
4. THE Navbar SHALL render the link whose target path matches the current route's pathname with a foreground color sourced from `colors.telemetry.primary`, and SHALL render every other link with a foreground color sourced from `colors.text.primary`.
5. WHEN the document scroll offset crosses the 16-pixel threshold in either direction, THE Navbar SHALL transition between the transparent state and the surfaced state over a duration between 150 and 300 milliseconds inclusive.
6. IF Reduced_Motion is active, THEN THE Navbar SHALL change between the transparent state and the surfaced state immediately at the threshold without animating the transition.

### Requirement 13: Apply Light_Theme and motion to home-page sections

**User Story:** As a visitor on the home page, I want every section to share a consistent light industrial treatment with smooth reveals, so that the page reads as one continuous document.

#### Acceptance Criteria

1. THE HeroSection, AboutSection, EcosystemSection, DeploymentSection, ProductSlider, IndustryProblemSection, InspectionVisibilitySection, PlatformOverviewSection, and ContactSection SHALL each render their root container background sourced from `colors.background.primary`, and SHALL contain zero hard-coded hex literals matching the regular expression `#[0-9A-Fa-f]{3,6}` outside of references to `src/design/colors.js` Theme_Tokens.
2. THE EcosystemSection SHALL render its flow diagram strokes using `colors.process.primary`.
3. THE EcosystemSection SHALL render its flow diagram node fills using `colors.background.primary`.
4. THE DeploymentSection SHALL render its on-premise architecture strokes using `colors.telemetry.primary`.
5. THE DeploymentSection SHALL render an Industrial_Decor ruler-tick separator between each pair of adjacent architectural zones.
6. WHEN the user advances the ProductSlider to a different card, THE Motion_Layer SHALL animate the horizontal card transition with a duration between 200 and 450 milliseconds inclusive.
7. WHEN a ProductCard's bounding rectangle has at least 50 percent of its area within the viewport, THE GSAP_Layer SHALL drive that card's animated visual (defect grid or data flow).
8. IF a ProductCard's bounding rectangle has less than 10 percent of its area within the viewport, THEN THE Tvastr_Site SHALL pause that card's animated visual and retain its last rendered frame.
9. WHEN the founder's email link or LinkedIn link in the ContactSection receives focus-visible, THE ContactSection SHALL render an underline using `colors.telemetry.primary`.
10. IF Reduced_Motion is active, THEN every animation defined by criteria 6 through 9 SHALL complete within 50 milliseconds and SHALL render the final visual state.

### Requirement 14: Apply Light_Theme and motion to system detail pages

**User Story:** As a visitor reading a system detail page, I want technical content to feel like a precise blueprint document, so that the engineering substance comes through.

#### Acceptance Criteria

1. WHEN the RejectionAnalysisSystem or PlantIntelligence page mounts, THE Light_Theme SHALL render the page against `colors.background.primary`.
2. WHILE the viewport width is greater than 1024 pixels, THE Industrial_Decor SHALL display blueprint corner guides on the RejectionAnalysisSystem and PlantIntelligence pages.
3. IF the viewport width is 1024 pixels or less, THEN THE Industrial_Decor SHALL omit blueprint corner guides on the RejectionAnalysisSystem and PlantIntelligence pages.
4. WHEN a SystemImageBlock first attains at least 10 percent of its bounding-box area within the viewport, THE GSAP_Layer SHALL reveal the SystemImageBlock exactly once with a duration between 400 and 900 milliseconds inclusive.
5. THE SystemWorkflow component SHALL render its connector lines using `colors.border.strong` with a stroke width between 1 and 3 pixels inclusive, and SHALL render its node labels using `colors.text.primary`.
6. THE SystemImpactGrid component SHALL render impact metric tiles with a machined-corner clip on at least one corner of each tile, where the clip size is between 8 and 24 pixels inclusive.
7. IF the SystemImpactGrid component receives no impact metric data, THEN THE SystemImpactGrid SHALL display an empty-state indicator and SHALL NOT render any tiles.

### Requirement 15: Apply Light_Theme to the portal and preserve tier-gating UX

**User Story:** As a customer signed in to the portal, I want the dashboard, downloads page, and locked screens to read clearly in Light_Theme, so that my license state and download options are unambiguous.

#### Acceptance Criteria

1. THE PortalLogin, PortalDashboard, and PortalDownloads pages SHALL render their root container background sourced from `colors.background.primary`, body text sourced from `colors.text.primary`, and muted metadata sourced from `colors.text.muted`.
2. THE Tier_Badge for an `ACTIVE` state SHALL display the literal label text `ACTIVE`, render its foreground sourced from `colors.signal.warning`, and render its border sourced from `colors.signal.warning` at an alpha between 0.3 and 0.5 inclusive, regardless of which tier produced the active state.
3. THE Tier_Badge for an `INCLUDED` state SHALL display the literal label text `INCLUDED`, render its foreground sourced from `colors.text.muted`, and render a 1-pixel border sourced from `colors.text.muted` at an alpha between 0.3 and 0.5 inclusive.
4. THE Tier_Badge for a `LOCKED` state SHALL render its foreground sourced from `colors.text.muted`, an icon sourced from the existing lock iconography, and an upgrade CTA whose accent is sourced from `colors.signal.warning`; WHEN the upgrade CTA is activated, THE Tvastr_Site SHALL navigate to the upgrade flow.
5. WHILE the user's license tier is `ras_core`, THE PortalDashboard SHALL render a `LOCKED` Tier_Badge on the RAS Enterprise card and on the Plant Intelligence card.
6. WHILE the user's license tier is `ras_enterprise`, THE PortalDashboard SHALL render an `ACTIVE` Tier_Badge on the RAS Enterprise card and a `LOCKED` Tier_Badge on the Plant Intelligence card.
7. WHILE the user's license tier is `full_stack`, THE PortalDashboard SHALL render an `ACTIVE` Tier_Badge on the Plant Intelligence card and an `INCLUDED` Tier_Badge on the RAS Enterprise card.
8. WHILE the user's license tier is `full_stack`, THE PortalDashboard SHALL NOT render the UpgradeBanner.
9. WHEN the user navigates to a route guarded by a tier the user does not hold, THE LockedScreen SHALL render the lock icon, the feature title matching the guarded route's product name, an upgrade message identifying the minimum required license tier, and the upgrade CTA, sourcing all colors from Theme_Tokens.
10. IF the user's license tier is unrecognized or undefined, THEN THE PortalDashboard SHALL render a `LOCKED` Tier_Badge on every product card and SHALL display the UpgradeBanner.

### Requirement 16: Theme-Token resolution invariants

**User Story:** As an engineer, I want guarantees that every Theme_Token referenced by the app resolves to a defined value, so that we never ship with a missing or undefined color.

#### Acceptance Criteria

1. FOR ALL Tailwind utility classes that reference a Theme_Token (`bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`) used anywhere in `src/`, THE Tvastr_Site SHALL resolve the class to a CSS color string of length at least 4 characters that is parseable as a valid CSS color at build time.
2. FOR ALL CSS custom properties declared in `src/index.css` whose name begins with `--bg-`, `--text-`, `--telemetry-`, `--process-`, `--signal-`, or `--border-`, THE Tvastr_Site SHALL define a value that is either a 7-character lowercase hex code matching `^#[0-9a-f]{6}$` or a valid `rgba()` expression with R, G, and B components as integers in 0–255 and A as a decimal in 0.0–1.0.
3. THE Tvastr_Site SHALL produce no runtime references to undefined Theme_Tokens.
4. IF the build pipeline detects any reference to a Theme_Token that has no definition in `src/design/colors.js`, THEN THE build SHALL fail with a non-zero exit status, emit an error identifying every missing token and its source location, and produce no deployable build artifacts.
5. FOR ALL Theme_Tokens whose category is `background`, `text`, `telemetry`, `process`, or `signal`, THE Tvastr_Site SHALL store the value as a 7-character lowercase hex code matching the regular expression `^#[0-9a-f]{6}$`.

### Requirement 17: Animations never block input

**User Story:** As a user, I want to be able to click and type at all times, so that motion never gets in my way.

#### Acceptance Criteria

1. WHILE any GSAP_Layer or Motion_Layer animation is running, THE Tvastr_Site SHALL keep all CTA buttons, navigation links, and form inputs operable: every such element SHALL remain in the document tab order, SHALL dispatch pointer events to its event handlers, and SHALL accept keystrokes with input-to-character-rendered latency at most 50 milliseconds on a Desktop_Reference_Device.
2. WHILE any animation is running, THE Tvastr_Site SHALL ensure that every focusable descendant of an animating element continues to receive pointer and keyboard events.
3. WHEN the user clicks a CTA whose magnetic hover animation is in progress, THE Tvastr_Site SHALL fire the click handler with a latency that exceeds the non-animated baseline click handler latency by no more than 16 milliseconds, and that does not exceed 50 milliseconds in absolute terms on a Desktop_Reference_Device.
4. THE Tvastr_Site SHALL keep main-thread Animation_Frame_Budget consumption from animation work at or below 8 milliseconds per frame on a Desktop_Reference_Device.
5. IF Animation_Frame_Budget consumption exceeds 8 milliseconds per frame for more than 500 milliseconds in any 5-second window on a Desktop_Reference_Device, THEN THE Tvastr_Site SHALL pause non-essential animations until consumption returns below the budget, and SHALL preserve focus state and keyboard operability throughout.

### Requirement 18: Responsive behavior across device classes

**User Story:** As a user on mobile, tablet, or desktop, I want the redesigned site and its motion to feel appropriate for my device, so that nothing feels broken or excessive.

#### Acceptance Criteria

1. WHILE the viewport width is less than 640 pixels, THE Industrial_Decor blueprint corner guides SHALL render at exactly 50 percent of their desktop stroke length.
2. WHILE the viewport width is less than 640 pixels, THE Tvastr_Site SHALL NOT render the cursor follower or apply the magnetic hover effect.
3. WHILE the viewport width is between 640 and 1024 pixels inclusive, THE GSAP_Layer SHALL multiply all section reveal durations by 0.7 (a 30 percent reduction) relative to their desktop values.
4. WHILE the viewport width is greater than or equal to 1024 pixels, THE Tvastr_Site SHALL render the full Industrial_Decor set as defined in Requirement 6.
5. WHILE the device reports `(hover: none)`, THE Tvastr_Site SHALL apply tap-state animations through the Motion_Layer instead of hover-state animations.
6. WHEN the viewport width crosses any of the 640-pixel or 1024-pixel breakpoints during a session, THE Tvastr_Site SHALL re-evaluate and apply the rules defined by criteria 1 through 5 within 200 milliseconds of the resize event.
7. IF the device cannot evaluate the `(hover: none)` media query, THEN THE Tvastr_Site SHALL apply tap-state animations.
8. IF the viewport width cannot be determined or is reported as 0 pixels, THEN THE Tvastr_Site SHALL apply the rules defined for the viewport-width-less-than-640-pixels case.

### Requirement 19: Performance budget for the redesign

**User Story:** As a product owner, I want the redesign to stay within a defined performance budget, so that we do not regress page-load metrics or runtime smoothness.

#### Acceptance Criteria

1. THE Tvastr_Site SHALL produce a production build whose total gzipped JS bundle, summed across every JS asset emitted by the production output, increases by no more than 120 KB compared to the production build of the commit immediately preceding the first commit of this feature.
2. THE Tvastr_Site SHALL produce a production build whose total gzipped CSS bundle, summed across every CSS asset emitted by the production output, increases by no more than 30 KB compared to the production build of the commit immediately preceding the first commit of this feature.
3. WHEN the home page production build is loaded on a Desktop_Reference_Device, THE Tvastr_Site SHALL achieve a Largest Contentful Paint not greater than 2.5 seconds and a Cumulative Layout Shift not greater than 0.1, measured as the median of three cold loads.
4. WHILE any scroll-linked GSAP_Layer timeline is active on a Desktop_Reference_Device, THE Tvastr_Site SHALL maintain an average frame rate of at least 55 frames per second over the timeline's full duration, with no more than 2 dropped frames per second.
5. IF the bundle-size budgets defined by criteria 1 or 2 are exceeded, THEN THE build pipeline SHALL fail with an error identifying the violated budget, the measured value, and the limit.
6. IF the runtime metrics defined by criteria 3 or 4 are violated during release verification, THEN THE release verification SHALL fail with an error identifying the violated metric and the measured value.

### Requirement 20: Idempotent and confluent theme application

**User Story:** As an engineer running theme-related operations, I want theme application to be predictable, so that repeated runs of the same operation produce the same result.

#### Acceptance Criteria

1. WHEN the Theme_Editor saves the same color map a second time without intervening edits, THE Tvastr_Site SHALL produce a `src/design/colors.js` whose byte sequence is identical to the byte sequence produced by the first save, including key ordering, indentation, quoting style, and line endings.
2. WHEN the Theme_Editor exports a JSON theme, then imports the exported JSON, then saves, THE Tvastr_Site SHALL produce a `src/design/colors.js` in which every Theme_Token value equals the corresponding value in the exported JSON.
3. GIVEN two Theme_Token edits that target distinct key paths, WHEN both edits are applied in either order, THE Tvastr_Site SHALL produce identical final byte sequences for `src/design/colors.js` regardless of the order of application.
4. GIVEN two Theme_Token edits that target the same key path, WHEN both edits are applied in sequence, THE Tvastr_Site SHALL produce a `src/design/colors.js` whose value at that key path equals the value supplied by the most recent edit (last-write-wins).
5. IF the Theme_Editor cannot write `src/design/colors.js` (e.g., file is read-only or disk is full), THEN THE Theme_Editor SHALL leave the existing file content unchanged and surface an error indicating the failure cause.

### Requirement 21: Error handling for animation and theme resolution

**User Story:** As a user, I want the site to keep working even if the animation libraries or theme tokens fail to load, so that I never see a broken page.

#### Acceptance Criteria

1. IF the GSAP library fails to load within 10 seconds of page load or its module import resolves with an error, THEN THE Tvastr_Site SHALL render every section in its final visual state without scroll-linked animation, SHALL preserve the original layout bounds and dimensions of each section, and SHALL log exactly one warning to the console per page load identifying GSAP as the failed library.
2. IF the Framer Motion library fails to load within 10 seconds of page load or its module import resolves with an error, THEN THE Tvastr_Site SHALL render every component in its final visual state without enter or exit transitions, SHALL preserve the original layout bounds and dimensions of each component, and SHALL log exactly one warning to the console per page load identifying Framer Motion as the failed library.
3. IF a referenced Theme_Token resolves to an empty or undefined value at runtime, THEN THE Tvastr_Site SHALL fall back to `colors.text.primary` for foreground references and `colors.background.primary` for background references, and SHALL log exactly one warning to the console per page load per missing token, naming the missing token.
4. IF a fallback Theme_Token (`colors.text.primary` or `colors.background.primary`) itself resolves to an empty or undefined value at runtime, THEN THE Tvastr_Site SHALL apply a hard-coded neutral foreground for foreground references and a hard-coded neutral background for background references, and SHALL log exactly one warning to the console per page load per unresolved fallback token, naming the unresolved fallback token.
5. IF the Forge_Core's WebGL context is lost, THEN THE Forge_Core SHALL render a static SVG fallback whose accent color is sourced from `semantic.brand`, SHALL preserve the original layout bounds and dimensions of the Forge_Core surface, and SHALL log exactly one warning to the console per page load identifying the WebGL context loss.
