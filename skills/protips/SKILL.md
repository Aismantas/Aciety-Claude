# Protips Skill

## Trigger
User runs `/protips <google-doc-url>`

---

## Purpose

Guide the user from a raw product idea through a dynamic Lightning Round Q&A session (50–100 questions) and produce a structured **Raw Output** document written to the Google Doc's `Raw Output` tab.

The Raw Output feeds directly into the next step: `/product-spec <google-doc-url>`, which reads from the `Raw Output` tab.

---

## Required Google Doc Tabs

| Tab Name | Purpose |
|----------|---------|
| `Raw Input` | User's initial product idea, brief, or context. Claude reads this. |
| `Raw Output` | Where Claude writes the final structured Q&A summary. `/product-spec` reads this next. |

> **Claude cannot create tabs.** If either tab is missing, stop and ask the user to add them manually, then re-run `/protips <url>`.

---

## Phase 0 — Open & Audit the Doc

1. Use `mcp__google-docs__listTabs` with the provided doc URL.
2. Check that both `Raw Input` and `Raw Output` tabs exist.
   - If either is missing, stop and ask the user to add them.
3. Read the `Raw Input` tab using `mcp__google-docs__readDocument`.
4. If `Raw Input` is empty, stop and ask the user to add their product idea there first.
5. Acknowledge what you found in one sentence (product theme, key context).

---

## Phase 1 — Seed the Session

Ask:

> "Give me 1–2 sentences: **what is this product**, and who are its **main competitors or inspirations**?"

Wait for the user's answer. This is the foundation for all generated questions.

---

## Phase 2 — Lightning Round

Conduct a dynamic Q&A session. Generate questions one at a time.

### Question Format

Every question must follow this exact format:

```
Q[N]: [Question — specific, one sentence]

A) [Option — one sentence]
B) [Option — one sentence]
C) [Option — one sentence]
D) Custom: ___

(Pick one or more, combine, or write your own)
```

### Question Generation Rules

- Generate the **single most important unanswered question** based on all prior answers
- **Never batch multiple questions** — one at a time only
- **Never repeat** a question already answered
- **Prioritize foundations before details**
- Keep options distinct from each other and genuinely useful

### Session Termination

End when: user types `done`/`finish`/`skip`/`end`, all 5 phases have ≥10 questions answered, or 100 questions answered.

---

## 5-Phase Framework

Balance questions across phases. Do not exhaust one phase before moving to the next.

### Phase 1 — Discovery & Strategy (~15 questions)
- Core problem, target audience, competitors, unique edge, success metrics

### Phase 2 — Product Definition (~15 questions)
- MVP scope, core user flow, must-have vs. nice-to-have, key assumptions

### Phase 3 — Design & Validation (~10 questions)
- Key screens, input/output of main flow, cheap validation methods

### Phase 4 — Technical Planning & Code Re-use (~10 questions)
- Stack confirmation (default: **Node.js + Supabase + Vercel**)
- Existing repos/libraries covering ≥50% of a feature
- Key data entities, integrations

### Phase 5 — Handoff (~10 questions)
- Acceptance criteria for v1, out of scope, versioning plan

---

## Phase 3 — Generate & Write Raw Output

Write to the `Raw Output` tab using `mcp__google-docs__replaceDocumentWithMarkdown`.

### Raw Output Format

```markdown
# Raw Output — [Product Name]

*Generated: [date] | Questions answered: [N]*

---

## Product Summary
[3–5 sentence synthesis: what it is, who it's for, what makes it different, core flow, default stack]

---

## Code Re-use Opportunities
| Repo / Tool | What it covers | Link |
|-------------|----------------|------|

---

## Q&A by Phase

### Phase 1 — Discovery & Strategy
| # | Question | Answer |
|---|----------|--------|

### Phase 2 — Product Definition
| # | Question | Answer |
|---|----------|--------|

### Phase 3 — Design & Validation
| # | Question | Answer |
|---|----------|--------|

### Phase 4 — Technical Planning & Code Re-use
| # | Question | Answer |
|---|----------|--------|

### Phase 5 — Handoff
| # | Question | Answer |
|---|----------|--------|

---

## Open Questions
[Ambiguous points the spec writer should resolve before proceeding]
```

---

## Phase 4 — Handoff Message

```
✅ Raw Output written.

Doc: <url>
Tab: Raw Output
Questions answered: [N]

Next: Run /product-spec <url> to generate the full specification.
```

---

## Constraints

- **One question at a time** — never batch
- **Do not write code** — spec only
- **Do not create tabs** — Claude cannot create Google Doc tabs
- Default stack is **Node.js + Supabase + Vercel** unless user specifies otherwise
- The Raw Output must be self-contained
