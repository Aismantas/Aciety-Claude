---
name: product-loop
description: Iterative product build loop — reads spec from Google Doc, defines the next version increment, builds it using ECC skills, verifies, documents, and prompts for the next iteration.
---

# Product Loop (v0.x → v0.x+1)

Orchestrates the incremental product build cycle using existing ECC skills. Does NOT reinvent logic — delegates every phase to the appropriate skill.

## When to Invoke

- Starting a new product build session
- Continuing from a previous version
- User says "let's build the next version" or "continue the product loop"

## Inputs Required

- **Spec doc URL** — Google Doc containing version tabs (v0.1, v0.2, etc.)
- **Project directory** — local path of the codebase
- **Dev server port** — current localhost port (check with `netstat -ano | grep ":300"`)

## RAPID Mode

If the user includes the word **RAPID** in their invocation, skip all test-related steps.
Label the loop clearly at the start: `⚡ RAPID mode — tests skipped.`

---

## Spec Doc Structure

Single Google Doc with one tab per version plus persistent shared tabs:

| Tab Name | Purpose |
|----------|---------|
| `Raw Input` | Original product idea (read-only reference) |
| `Specifications` | PRD, architecture, tech stack (written by /product-spec) |
| `Tests` | Accumulates test plans per version |
| `v0.1`, `v0.2`… | Per-version scope and build log |

**Always use `mcp__google-docs__listTabs` to discover tabs. Never hardcode IDs.**

---

## Phase 0 — Orient

1. List all tabs via `mcp__google-docs__listTabs`
2. Read the latest implemented version tab and the next planned version tab
3. If no next version tab exists: ask the user to add one

## Phase 1 — Plan

Delegate to `everything-claude-code:planner`. Write spec to version tab (status: In Progress).
**WAIT for user CONFIRM before touching any code.**

## Phase 2 — Build

For each feature:
1. TDD → `everything-claude-code:tdd-guide`
2. Write code
3. Code review → `everything-claude-code:code-reviewer`
4. Security → `everything-claude-code:security-reviewer` (if auth/API/input/secrets)
5. Maintain test fixture `e2e/fixtures/test-content.ts` _(skip RAPID)_
6. Write test plan to Tests tab _(skip RAPID)_

## Phase 3 — Verify

1. Check server: `netstat -ano | grep ":300"`
2. Screenshot: `cd C:/Users/YOUR_USERNAME/HomeApps && node screenshot.mjs http://localhost:<port> v<N>-verify`
3. Read screenshot
4. Verification loop → `everything-claude-code:verification-loop` _(skip RAPID)_
5. E2E: `npx playwright test --project=chromium` _(skip RAPID)_
6. DB check via `mcp__supabase__execute_sql`
7. Document results in Tests tab _(skip RAPID)_
8. Gate: all tests must pass before Phase 4 _(skip RAPID)_

## Phase 4 — Document

Update version tab: mark Implemented, note deviations, check off acceptance criteria.

## Phase 5 — Prompt for Next

> "v0.X is complete. Want to define v0.X+1?"

---

## ECC Skills Used

| Phase | Skill |
|-------|-------|
| Plan | `everything-claude-code:planner` |
| TDD | `everything-claude-code:tdd-guide` |
| Code review | `everything-claude-code:code-reviewer` |
| Security | `everything-claude-code:security-reviewer` |
| Verification | `everything-claude-code:verification-loop` |
| E2E testing | `everything-claude-code:e2e-runner` |
| Design check | screenshot.mjs + Read tool |
| DB inspection | `mcp__supabase__execute_sql` |
| Doc read/write | `mcp__google-docs__readDocument` + `appendMarkdown` + `replaceDocumentWithMarkdown` |
