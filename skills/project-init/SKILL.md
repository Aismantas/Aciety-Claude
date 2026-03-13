---
name: project-init
description: Bridge between /product-spec and /product-loop. Reads the Specifications tab, creates a new Supabase project, copies the saas-template, adapts it to the spec, applies the initial migration, and verifies the dev server is running.
---

# Project Init

## Trigger
User runs `/project-init <google-doc-url>`

---

## Purpose

Take a completed `Specifications` tab and produce a running local project ready for `/product-loop`.

**Pipeline position:**
```
/protips  →  Raw Output tab
/product-spec  →  Specifications tab
[/project-init]  →  C:/Users/YOUR_USERNAME/Projects/{name}/ + Supabase project + running dev server
/product-loop  →  v0.1, v0.2, ...
```

---

## Required Google Doc Tabs

| Tab Name | Purpose |
|----------|---------|
| `Specifications` | Written by `/product-spec`. Claude reads this. |

> Claude cannot create tabs. If `Specifications` is missing or empty, stop and ask the user to run `/product-spec <url>` first.

---

## Phase 0 — Read the Spec

1. Use `mcp__google-docs__listTabs` to list tabs.
2. Find the `Specifications` tab — match by name, never hardcode IDs.
3. Read it with `mcp__google-docs__readDocument` (format: markdown).
4. If missing or empty → stop: "Please run `/product-spec <url>` first."

Extract: product name (→ kebab-slug), tech stack deviations, auth strategy, integrations, DB schema, non-functionals.

---

## Phase 1 — Confirm Project Setup

Present to the user and **wait for confirmation** before creating anything:

```
Ready to initialise a new project.

Project name:   {product-name}
Folder:         C:/Users/YOUR_USERNAME/Projects/{slug}/
Base template:  C:/Users/YOUR_USERNAME/Projects/saas-template/
Supabase:       New project will be created (you'll need org + region)

Stack from spec:
- Frontend: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Auth + DB: Supabase
- Billing: Stripe
- E2E: Playwright
[+ any spec-specific additions]

Confirm to proceed?
```

If the target folder already exists → warn of overwrite.

---

## Phase 2 — Create Supabase Project

1. `mcp__supabase__get_cost` → `mcp__supabase__confirm_cost`
2. Ask user for org + region (default: `eu-west-1`)
3. `mcp__supabase__create_project` — wait for `ACTIVE_HEALTHY`
4. Get project URL + anon key

---

## Phase 3 — Copy and Adapt the Template

### 3a — Copy
```bash
cp -r C:/Users/YOUR_USERNAME/Projects/saas-template C:/Users/YOUR_USERNAME/Projects/{slug}
rm -rf C:/Users/YOUR_USERNAME/Projects/{slug}/.git
cd C:/Users/YOUR_USERNAME/Projects/{slug} && npm install
```

### 3b — Replace database migration
Replace `supabase/migrations/00001_initial.sql` with spec-driven schema.
**Always keep:** `profiles` table, RLS on all tables, `handle_new_user()` trigger.

### 3c — Replace types/index.ts
**Always keep:** `ApiResponse<T>`, `SubscriptionTier`, `UserProfile`.
Add one interface per DB entity from the spec.

### 3d — Rewrite CLAUDE.md
Replace with product-specific version covering stack, architecture rules, key constraints, spec doc URL.

### 3e — Write .env.local
```
NEXT_PUBLIC_SUPABASE_URL={from-phase-2}
NEXT_PUBLIC_SUPABASE_ANON_KEY={from-phase-2}
SUPABASE_SERVICE_ROLE_KEY=TODO_get_from_supabase_dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=TODO_get_from_stripe_dashboard
STRIPE_SECRET_KEY=TODO_get_from_stripe_dashboard
STRIPE_WEBHOOK_SECRET=TODO_get_from_stripe_dashboard
```

### 3f — Update package.json name field

---

## Phase 4 — Apply Initial Migration

`mcp__supabase__apply_migration` — if fails, stop and show error.

---

## Phase 5 — Verify Dev Server

```bash
cd C:/Users/YOUR_USERNAME/Projects/{slug} && npm run dev 2>&1 &
netstat -ano | grep ":300"
```

Check ports 3000 → 3001 → 3002 if needed. Screenshot and read with Read tool.

---

## Phase 6 — Handoff

```
✅ Project initialised.

Path:         C:/Users/YOUR_USERNAME/Projects/{slug}/
Port:         {port}
Supabase:     {project-url}
Migration:    applied (00001_initial.sql)
Spec doc:     {google-doc-url}

Remaining TODOs in .env.local:
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Next: /product-loop {google-doc-url} to begin scoping and building v0.1.
```

---

## Constraints

- **Never scaffold from scratch** — always copy `C:/Users/YOUR_USERNAME/Projects/saas-template/`
- **Always keep Stripe** — even if spec has no billing yet
- **Always keep Playwright** — even if spec has no E2E tests defined yet
- **Never modify** `~/.claude.json` or `~/.claude/settings.json`
- **Never write feature code** — scaffolding only; that is `/product-loop`'s job
- **Never create version tabs** — that is `/product-loop`'s job
- **Wait for user confirmation** before creating any files or Supabase resources
