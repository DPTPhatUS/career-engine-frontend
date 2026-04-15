# Design System: The Architectural Utility

## 1. Overview & Creative North Star: "Precision Functionalism"
While the foundation of this design system is built upon utility-first principles and developer-friendly frameworks like DaisyUI and Tailwind, the execution must transcend the "generic bootstrap" aesthetic. 

Our Creative North Star is **Precision Functionalism**. We treat the UI not as a collection of boxes, but as a high-end instrument. The goal is to create a "Signature Utility" experience—where the beauty is found in the spacing, the subtle shifts in tonal depth, and the authoritative use of typography. We break the template look by replacing rigid lines with logical layering and using intentional asymmetry in layout to guide the eye toward primary actions.

---

## 2. Colors & Tonal Depth
This system moves away from flat, "paper-white" designs toward a sophisticated, multi-layered blue-scale environment.

### The "No-Line" Rule
**Explicit Instruction:** Prohibition of `1px solid` borders for sectioning or containment. 
Boundaries must be defined solely through background color shifts. Instead of drawing a line to separate a sidebar, use `surface_container_low` against a `surface` background. This creates a more cohesive, high-end feel that reduces visual noise.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to define importance:
- **Base Layer:** `surface` (#f8f9ff) – The canvas.
- **Sectioning:** `surface_container_low` (#eff4ff) – Large structural areas (sidebars, secondary panels).
- **Interactive Elements:** `surface_container_highest` (#d9e3f6) – High-emphasis internal containers.
- **The "Floating" Surface:** `surface_container_lowest` (#ffffff) – Reserved for the most important interactive cards or modals to make them "pop" against the tinted background.

### The "Glass & Gradient" Rule
To elevate the utility-first approach, apply **Glassmorphism** for floating UI elements (like navigation bars or dropdowns). Use a semi-transparent `surface_container_lowest` with a `backdrop-blur-md` effect.
- **Signature Texture:** Primary CTAs should use a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle. This adds "soul" and a tactile quality to the functional blue.

---

## 3. Typography: The Editorial Scale
We use **Inter** as a tool of precision. The hierarchy is designed to feel like a technical manual—clear, readable, yet unmistakably premium.

- **Display (lg/md/sm):** Used sparingly for hero moments. Tracking should be set to `-0.02em` to feel tighter and more "designed."
- **Headline & Title:** Use `on_surface` (#121c2a). These are the anchors of your layout. Ensure generous vertical rhythm above headlines to allow the content to breathe.
- **Body (lg/md/sm):** The workhorse. Always use `on_surface_variant` (#434655) for long-form body text to reduce eye strain and create a sophisticated "ink-on-paper" contrast ratio.
- **Labels (md/sm):** Use `label-md` in All-Caps with `tracking-widest` for secondary metadata or small headers above input fields to give a "blueprint" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often heavy and dated. We achieve depth through **Tonal Layering**.

- **The Layering Principle:** Place a `surface_container_lowest` card on top of a `surface_container_low` background. The natural contrast creates a "soft lift" without a single drop shadow.
- **Ambient Shadows:** For floating elements (modals), use an extra-diffused shadow: `box-shadow: 0 20px 25px -5px rgba(0, 74, 198, 0.04), 0 10px 10px -5px rgba(0, 74, 198, 0.02);`. This tints the shadow with our `primary` blue, making it feel integrated into the atmosphere.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` (#c3c6d7) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
- **Primary:** Gradient from `primary` to `primary_container`. Text: `on_primary`. Roundedness: `md` (0.375rem).
- **Secondary:** Surface-only. Background: `secondary_container` (#86f2e4). Text: `on_secondary_container`.
- **Tertiary:** No background. Text: `primary`. Hover state: subtle background shift to `surface_container_high`.

### Input Fields
- **Container:** Background `surface_container_lowest` (#ffffff).
- **Border:** Ghost Border (15% `outline_variant`). On focus, transition to 2px `primary`.
- **Label:** `label-md` sitting strictly above the field, never inside.

### Cards & Lists
- **Rule:** **Strictly forbid divider lines.** 
- Separate list items using 12px of vertical white space or by alternating background colors between `surface` and `surface_container_low`.
- For cards, use `rounded-xl` (0.75rem) to soften the "utility" feel and make the interface more approachable.

### Chips
- Use `secondary_fixed` (#89f5e7) for active filters and `surface_container_high` (#dee9fc) for inactive ones. This teal-to-blue transition provides a clear visual signal of state.

---

## 6. Do's and Don'ts

### Do:
- **Do** use asymmetrical padding. A page might have 80px of padding on the left and 120px on the right to create a sophisticated, editorial "white space" feel.
- **Do** use `primary_fixed_dim` for disabled states instead of generic grey. It keeps the "temperature" of the UI consistent.
- **Do** leverage `backdrop-blur` on any element that sits "above" the main content.

### Don't:
- **Don't** use `#000000` for text. Always use the `on_surface` (#121c2a) palette to maintain tonal harmony.
- **Don't** use standard DaisyUI border utilities. If you need a divider, use a 4px height `surface_container_highest` block with a 50% width—treat it as a design element, not a utility line.
- **Don't** overcrowd forms. Use the `body-lg` font size for inputs to ensure they feel substantial and premium.