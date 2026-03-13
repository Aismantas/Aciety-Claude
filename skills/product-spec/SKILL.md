# Product Spec Skill

## Trigger
User runs `/product-spec <google-doc-url>`

---

## Purpose

Transform a raw product idea (in a Google Doc) into a complete specification and implementation roadmap, then hand off to `/project-init` and `/product-loop`.

---

## Google Doc Structure (Required)

The doc must have these tabs. Claude cannot create tabs — ask the user to add any that are missing.

| Tab Name | Purpose |
|----------|---------|
| `Raw Output` | Structured Q&A from `/protips` — source of truth for the spec. Claude reads this. |
| `Specifications` | PRD, architecture, feature list, data model, non-functional requirements. Claude writes this. |
| `Tests` | Two sections: **Test Contents** (canonical fixture values) and **Test Results** (per-version outcomes). |

---

## Phase 0 — Open & Audit the Doc

1. Use `mcp__google-docs__listTabs` with the provided doc URL to list existing tabs.
2. Check for each required tab by name. If any are missing, stop and ask the user to create them manually.
3. Once all tabs exist, read the `Raw Output` tab using `mcp__google-docs__readDocument`.
4. If `Raw Output` is empty, stop and ask the user to run `/protips <url>` first.

---

## Phase 1 — Market & Competitive Research

Use `everything-claude-code:market-research` skill internally:
- Identify the problem space and target user
- Find 3–5 comparable products or prior art
- Note key differentiators and risks
- Write a 1-paragraph summary (used in the spec)

---

## Phase 2 — Architecture Decisions + Iterative Refinement

### Step 1 — Initial decisions

Produce these decisions from the raw input:

```
1. Product type        (SaaS web app / CLI tool / mobile app / API / library)
2. Tech stack          (frontend, backend, database, auth, hosting)
3. Auth strategy       (none / magic link / OAuth / JWT / Supabase Auth)
4. Integrations        (third-party APIs, webhooks, payments, etc.)
5. Non-functional      (performance targets, security posture, scale assumptions)
6. Deployment target   (Vercel / Supabase / Railway / self-hosted / other)
```

Prefer:
- **Supabase** for database + auth (already connected)
- **Next.js** for full-stack web apps
- **Google Docs MCP** for doc-linked workflows
- Battle-tested libraries over custom implementations

### Step 2 — Draft feature list

Produce up to 10 main features. For each, list up to 10 sub-features.

### Step 3 — Draft database schema

For each entity: name, key fields (with types), relationships, indexes.

### Step 4 — Iterative refinement loop (min 2, max 10 rounds)

Each round: review feature list, update schema, check consistency. Stop when stable for 2 rounds.

### Step 5 — Classify features

**MVP** — v0.1 to v1.0. No version assignments.
**Full Product** — in scope but outside MVP.
**Backlog** — useful but not committed.

---

## Phase 3 — Write the Specifications Tab

Rewrite the `Specifications` tab using `mcp__google-docs__replaceDocumentWithMarkdown`:

```markdown
# [Product Name] — Specification

## Problem Statement
## Target User
## Competitive Context
## Tech Stack
| Layer | Choice | Rationale |
|-------|--------|----------|

## Features
### [Feature Name]
- sub-features

## Feature Classification
### MVP (v0.1 → v1.0)
### Full Product (post-MVP)
### Backlog

## Database Schema
### [Entity]
| Field | Type | Notes |
Relationships: ...
Indexes: ...

## Non-Functional Requirements
## Open Questions
```

---

## Phase 4 — Handoff

```
✅ Specification complete.
Next: Run /project-init <url> to scaffold the project.
```

---

## Constraints

- Do not write code — spec only
- Do not create tabs (Claude cannot create Google Doc tabs)
- Do not scope version assignments — that is `/product-loop`'s responsibility
- Prefer familiar, battle-tested stacks unless Raw Input specifies otherwise
