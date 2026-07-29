# Portfolio Redesign Agent Brief

## Mission

Transform this portfolio frontend into a world-class, distinctive, production-quality experience while preserving its existing content, functionality, routes, integrations, and personal identity.

Do not begin implementation until the user gives the next command.

## Current Stack

- React 19
- TanStack Start and TanStack Router
- TypeScript
- Tailwind CSS 4
- Vite
- Motion is already installed
- Bun-based scripts

Work with the existing architecture. Do not replace the framework or perform unrelated rewrites.

## Mandatory Design and Motion References

Research and intentionally use ideas or techniques from **all** of these sources during implementation:

1. [Kokonut UI](https://kokonutui.com/) — polished interface composition and modern component treatment.
2. [React Bits](https://reactbits.dev/) — expressive React interactions and animated visual elements.
3. [Bklit](https://bklit.com/) — editorial visual direction, typography, layout rhythm, and premium presentation.
4. [Anime.js](https://animejs.com/) — **mandatory primary animation engine** for signature sequences and interactions.
5. [Motion](https://motion.dev/) — React-aware layout, presence, gesture, and scroll animation where it complements Anime.js.
6. [Magic UI](https://magicui.design/) — refined effects, micro-interactions, and high-impact portfolio presentation.

All six references must materially influence the result. Do not merely name them or copy whole pages/components. Adapt selected ideas into one coherent visual system that feels original to this portfolio.

### Anime.js Is Non-Negotiable

Anime.js must be installed and used in the finished implementation. It must power at least one prominent, clearly visible signature sequence and additional purposeful motion where appropriate, such as:

- hero entrance or text choreography;
- project/card reveal sequencing;
- navigation or section-transition choreography;
- SVG, line, number, or timeline animation.

Do not use Anime.js as an unused dependency or token one-line effect. Motion may complement it, but avoid having both libraries animate the same property on the same element. Clean up timelines and listeners when React components unmount.

## Critical Blog Constraint

**Do not change the blog section's structure.**

The current blog layout, item ordering, image-to-post association, and image presentation are required and must remain intact. Do not remove, replace, detach, reorder, or restructure the blog images or their related content.

Safe improvements are limited to visual polish that preserves the same semantic and data structure, such as color, typography, borders, shadows, responsive spacing, and carefully scoped motion. If a proposed global component or layout refactor would affect the blog structure, isolate the blog from that refactor.

Before editing the blog area, document its existing DOM/component/data structure. After editing, verify that the same posts and images render in the same structural relationship.

## Experience Direction

The result should feel premium, personal, fast, and memorable—not like a generic template or a collection of disconnected effects.

Prioritize:

- a strong, immediately legible hero and value proposition;
- confident typography with a deliberate type scale;
- consistent spacing, color, radius, border, shadow, and motion tokens;
- clear project storytelling and calls to action;
- refined navigation and section transitions;
- layered visual depth without visual noise;
- high-quality light/dark treatment if the existing portfolio supports themes;
- responsive composition designed for mobile, tablet, laptop, and wide desktop;
- motion that reinforces hierarchy and interaction feedback.

Avoid excessive gradients, random glassmorphism, perpetual motion, cursor-hostile effects, illegible text, layout shift, animation overload, and copy-pasted component-demo aesthetics.

## Engineering Rules

- Inspect the current repository and running UI before redesigning.
- Preserve routes, content, links, forms, data loading, authentication, storage, analytics, and backend behavior unless the user explicitly changes their scope.
- Prefer reusable, typed React components and centralized design/motion tokens.
- Keep effects local, composable, and easy to remove or tune.
- Do not introduce multiple libraries that solve the same problem without a clear reason.
- Avoid destructive or broad dependency upgrades unrelated to the redesign.
- Keep secrets out of source control. Use the existing environment-variable model.
- Preserve correct semantic HTML and progressive enhancement.
- Do not suppress TypeScript, lint, or accessibility failures to make checks pass.

## Accessibility and Reduced Motion

The visual upgrade must remain usable:

- support keyboard navigation and visible focus states;
- preserve correct heading hierarchy and landmarks;
- use descriptive accessible names and meaningful alternative text;
- meet WCAG AA contrast for normal text and essential UI;
- ensure interactive targets are comfortably sized;
- do not rely on hover alone;
- prevent focus loss during animated transitions;
- honor `prefers-reduced-motion`;
- provide a calm reduced-motion path that avoids large transforms, parallax, rapid flashing, and long staggered sequences.

## Performance

Aim for a smooth experience on mainstream mobile and desktop hardware.

- Animate transform and opacity when practical.
- Avoid forced layout in animation loops.
- Pause off-screen or nonessential continuous effects.
- Lazy-load heavy visual assets and noncritical sections where appropriate.
- Optimize images without changing the blog image/content relationships.
- Avoid unnecessarily large bundles and duplicated animation functionality.
- Check for layout shift, long tasks, hydration issues, and console errors.

## Required Workflow for the Future Implementation

1. Audit the existing routes, components, assets, blog structure, responsive behavior, and current rendered UI.
2. Review all six mandatory reference sites and record the specific ideas selected from each.
3. Define a coherent visual and motion system before broad component edits.
4. Implement in controlled sections while keeping the portfolio functional.
5. Integrate Anime.js as a real, central part of the interaction system.
6. Verify the blog section's structure and image associations have not changed.
7. Run formatting, linting, type/build checks, and tests.
8. Run the site and inspect the final rendered UI visually.
9. Capture screenshots after implementation at representative viewports:
   - mobile: approximately 390 × 844;
   - tablet: approximately 768 × 1024;
   - desktop: approximately 1440 × 900.
10. Review the screenshots for clipping, overlap, broken images, inconsistent spacing, poor contrast, animation artifacts, and blog regressions. Fix discovered problems and capture final verification screenshots.

Do not claim that the redesign is complete solely because the build passes. Completion requires visual inspection of the running application and screenshot-based verification.

## Project Commands

Use the repository's existing scripts unless inspection shows a more appropriate documented path:

```bash
bun install
bun run dev
bun run build
bun run test
bun run lint
bun run format:check
```

Do not run destructive cleanup commands unless they are necessary and explicitly approved.

## Completion Report

When implementation is authorized and finished, report:

- what changed and the design rationale;
- how each of the six mandatory references influenced the result;
- where and how Anime.js is used;
- confirmation that the blog structure and image associations were preserved;
- checks/tests run and their results;
- viewport screenshots captured and any visual issues corrected;
- any remaining limitations or follow-up recommendations.
