# Aciety-Claude

Experimental Product Management Custom Claude Code skills, hooks, and rules for the Aciety product pipeline.

Clone this repo and copy the files into place as part of the Claude Code setup process. 

## Contents

```
skills/
  frontend-design/SKILL.md   — Production-grade UI generation
  product-spec/SKILL.md      — Spec writer: Raw Output → Specifications tab
  product-loop/SKILL.md      — Iterative build loop (v0.1 → v1.0)
  project-init/SKILL.md      — Project scaffolder: spec → running Next.js app
  sync-setup/SKILL.md        — Keeps the setup Google Doc in sync with config
  protips/SKILL.md           — Lightning-round Q&A to generate Raw Output
hooks/
  check-config-changes.mjs   — Stop hook: reminds to run /sync-setup if config drifted
  stamp-sync.mjs             — Stamps last-sync timestamp after /sync-setup runs
rules/
  common/
    design-workflow.md       — Design-first principle + screenshot loop
settings.template.json       — settings.json template with YOUR_USERNAME placeholders
```

## Installation

```bash
git clone https://github.com/Aismantas/Aciety-Claude.git ~/Aciety-Claude

# Copy skills
cp -r ~/Aciety-Claude/skills/* ~/.claude/skills/

# Copy hooks
cp ~/Aciety-Claude/hooks/*.mjs ~/.claude/hooks/

# Copy custom rule
cp ~/Aciety-Claude/rules/common/design-workflow.md ~/.claude/rules/common/

# Copy settings template (replace YOUR_USERNAME with your Windows username)
cp ~/Aciety-Claude/settings.template.json ~/.claude/settings.json
# Then edit ~/.claude/settings.json and replace all YOUR_USERNAME occurrences
```

## Product Pipeline

```
/protips <doc-url>       — Lightning Q&A → Raw Output tab
/product-spec <doc-url>  — Raw Output → Specifications tab
/project-init <doc-url>  — Specifications → scaffolded project + Supabase
/product-loop <doc-url>  — Iterative build: v0.1 → v1.0
/sync-setup              — Sync config state → setup Google Doc
```
