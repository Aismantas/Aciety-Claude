# Design Workflow

## Design-First Principle

**Every project starts with visual design before writing any logic code.**

Order of work:
1. Design the UI (layout, components, visual hierarchy)
2. Screenshot and review
3. Iterate until the design is right
4. Then implement logic, data, and backend

## Screenshot Utility (Global)

Puppeteer is installed at `C:/Users/YOUR_USERNAME/HomeApps/node_modules/puppeteer`.
Chrome cache is at `C:/Users/YOUR_USERNAME/.cache/puppeteer/`.

**Always use the HomeApps screenshot.mjs for design work:**
```
cd C:/Users/YOUR_USERNAME/HomeApps && node screenshot.mjs <url> [label]
```

Screenshots save to `C:/Users/YOUR_USERNAME/HomeApps/temporary screenshots/screenshot-N[-label].png`

**Before every screenshot, verify the correct port:**
```
netstat -ano | grep ":300"
```

**After screenshotting:** Read the PNG with the Read tool — Claude can see and analyze the image directly.

## Screenshot → Review → Fix Loop

MANDATORY for all design work:
1. Make changes
2. Screenshot: `cd C:/Users/YOUR_USERNAME/HomeApps && node screenshot.mjs http://localhost:<port> <label>`
3. Read the PNG and analyze
4. List specific issues (size, spacing, color, alignment — with exact values)
5. Fix, repeat from step 2
6. Minimum 2 rounds. Stop only when no visible issues remain or user confirms.

## Dev Server Rules

- Always serve on localhost — never screenshot `file:///` URLs
- Check if server is already running before starting a new one
- For Next.js projects: `cd <project> && npm run dev`
- For static projects: `cd C:/Users/YOUR_USERNAME/HomeApps && node serve.mjs`
- Note the port in the startup logs — it may not always be 3000

## Design Quality Standards

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600). Pick a custom brand color.
- **Shadows:** Use layered, color-tinted shadows. Never flat `shadow-md`.
- **Typography:** Pair display/serif with clean sans. Tight tracking on headings, generous line-height on body.
- **Spacing:** Use intentional, consistent tokens — not random Tailwind steps.
- **Depth:** Surfaces must have a layering system (base → elevated → floating).
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`.

## When to Use frontend-design Skill

Invoke the `frontend-design` skill before writing any frontend code for a new project or new UI section. It provides production-grade component patterns and prevents generic AI-looking output.
