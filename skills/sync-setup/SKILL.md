# Sync Setup Skill

## Trigger
User runs `/sync-setup`
Also called automatically by the Stop hook at session end (if config files changed).

---

## Purpose

Reads the actual current state of `~/.claude.json`, `~/.claude/settings.json`, and all skill/rule files, then updates the relevant tabs in the Claude setup Google Doc to match. Appends a timestamped changelog entry so drift is always traceable.

**Setup doc:** `https://docs.google.com/document/d/13hTlZq4GUoToCSvJZPcen1yT9CgM1FeLAHHWzJ_CiSQ`

---

## Config → Tab Mapping

| Source file(s) | Doc tab to update |
|---|---|
| `~/.claude.json` → `mcpServers` keys | `0.1 Claude Setup (Windows)` — Section 1 (MCP table) |
| `~/.claude/settings.json` → `permissions` | `0.1 Claude Setup (Windows)` — Section 5 (Permissions) |
| `~/.claude/skills/` — custom skill dirs | `0.1 Claude Setup (Windows)` — Section 2 (Skills table) |
| `~/.claude/rules/common/` — rule files | `0.1 Claude Setup (Windows)` — Section 3 (Rules table) |
| `~/.claude.json` → `mcpServers` (detail) | `0.2.00 Dev MCPs` — individual MCP sections |

---

## Phase 0 — Read Current Config State

```bash
cat ~/.claude.json
cat ~/.claude/settings.json
ls ~/.claude/skills/
ls ~/.claude/rules/common/
```

Exclude `gws/` and `learned/` from skills list.

---

## Phase 1 — Read Current Doc State

```
mcp__google-docs__readDocument(
  documentId: "13hTlZq4GUoToCSvJZPcen1yT9CgM1FeLAHHWzJ_CiSQ",
  tabId: "t.hpvcye2z8cop",
  format: "markdown"
)
```

---

## Phase 2 — Diff and Identify Changes

Compare config vs doc. If nothing changed → output `✅ Setup doc is already up to date.` and stop.

---

## Phase 2b — Backlog Housekeeping (optional, user-triggered)

When user indicates a backlog item is done:
1. Read backlog tab (`ZZZ. Ideas Bucket`)
2. Move item to `## Archive` section with `**Completed:** YYYY-MM-DD`
3. Rewrite tab

**Rules:** Never delete. Never renumber active items. Only archive user-confirmed items.

---

## Phase 3 — Update Summary Tab

Rewrite `t.hpvcye2z8cop` with updated MCP/skills/rules/permissions. Preserve all narrative text.

---

## Phase 4 — Update MCPs Tab (if MCP changes)

Update `t.b5jnxnbgsh1r`. Skip if no MCP changes.

---

## Phase 5 — Append Changelog Entry

```markdown
### [YYYY-MM-DD] — sync-setup run
**Changes detected:** ...
**No changes detected in:** ...
```

---

## Phase 6 — Stamp Sync Time

```bash
node C:/Users/YOUR_USERNAME/.claude/hooks/stamp-sync.mjs
```

---

## Constraints

- **Never modify** `~/.claude.json` or `~/.claude/settings.json` — read only
- **Never delete** existing doc content without replacing it with updated content
- **Preserve** all narrative text, installation guides, and archive sections
- If uncertain whether content changed, err on the side of **not writing**
