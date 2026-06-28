[![npm version](https://img.shields.io/npm/v/@govindchaudhary/vibekit.svg)](https://www.npmjs.com/package/@govindchaudhary/vibekit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

# Vibekit

**Vibe code without losing the plot.** Vibekit keeps fast, AI-driven "vibe
coding" accurate by giving your assistant lean, *verifiable* context — a
lightweight alternative to heavyweight Spec-Driven Development (SDD). Instead of
generating a spec/plan/tasks document set for every feature, Vibekit maintains
**3 persistent markdown files** that any AI coding assistant — Copilot, Claude,
Cursor, Windsurf — reads automatically. No per-feature ceremony, no token bloat,
and a working setup in **under 2 minutes**. It's tool-agnostic by design: the
canonical file is `AGENTS.md`, and everything else mirrors from it.

> **Motto:** *vibe fast, stay grounded.* The `AGENTS.md` Verify-before-trust
> rule means the AI treats notes as hints and the current code as ground truth.

---

## Quickstart

```bash
npx @govindchaudhary/vibekit init
```

Answer one question ("What's this project mostly?") and you're done — under two
minutes to a working setup. Vibekit creates four files in your current
directory:

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Stable context + coding principles (the file AI actually reads) |
| `CHANGELOG.md` | Rolling log of recent changes |
| `DECISIONS.md` | Architecture decisions worth not re-litigating |
| `principles-catalog.md` | Human reference menu — **never loaded by AI** |

---

## Two ways to adopt it

**(a) Use this template (zero install).** Click **"Use this template"** at the
top of this GitHub repo to clone the structure into a fresh repository. Good for
brand-new projects.

**(b) npx CLI (add to an existing repo).** Run `npx @govindchaudhary/vibekit init` inside any
existing project to drop the files in without touching the rest of your code.

---

## Vibekit vs. typical SDD tools

| | Vibekit | Typical SDD tool (Spec-Kit, BMAD) |
| --- | --- | --- |
| Setup time | < 2 minutes | 15–60 minutes |
| Files per feature | 0 (3 persistent files total) | 3+ (spec, plan, tasks) per feature |
| Token overhead | Low — one stable context file | High — large generated specs reloaded |
| Best when | Solo devs / small teams wanting fast AI context | Large teams needing formal, auditable specs for complex features |

Use a full SDD framework when you genuinely need formal, reviewable
specifications per feature. Reach for Vibekit when you just want your AI
assistant to have accurate, lightweight context without the overhead.

---

## The 3 files

### `AGENTS.md` — stable context
The one file AI tools read by default. It holds your active principle packs, a
**Verify-before-trust** safeguard, your project stack, and your conventions.
Keep it accurate; it's the source of durable context.

### `CHANGELOG.md` — rolling log
Newest entry first. Each entry has an exact ISO date, what changed and why, and
the files/functions touched. Mark resolved entries `[DONE]`; `vibekit prune`
trims old resolved entries so the file stays small (~10 active entries max).

### `DECISIONS.md` — architecture decisions
Only record choices a future session would otherwise guess wrong or re-debate —
architecture and library choices, not routine bug fixes.

> **Verify-before-trust:** CHANGELOG and DECISIONS are *hints, not ground truth*.
> Before relying on an entry, confirm the referenced code still matches. If it
> doesn't, the current code wins.

---

## How packs work

A **pack** is a small, reusable block of coding principles wrapped in markers:

```markdown
<!-- pack:dev:start -->
### SOLID Principles
- ...
<!-- pack:dev:end -->
```

Built-in packs:

- **`core`** — always included (SRP, DRY, KISS, fail fast)
- **`dev`** — SOLID principles for application development
- **`data-eng`** — idempotency, schema validation, ETL separation, immutable raw data, reproducibility

Manage packs at any time:

```bash
vibekit packs add data-eng
vibekit packs remove dev
```

### Add a custom pack

1. Create `packs/<name>.md`, e.g. `packs/security.md`.
2. Wrap the content in markers whose name matches the file:

   ```markdown
   <!-- pack:security:start -->
   ### Security Principles
   - Least privilege: grant the minimum access required
   - Never trust client input: validate at every boundary
   <!-- pack:security:end -->
   ```

3. Activate it: `vibekit packs add security`.

See [`principles-catalog.md`](./principles-catalog.md) for the full menu.

---

## Commands

| Command | What it does |
| --- | --- |
| `vibekit init` | Scaffold the 4 files (asks one question). |
| `vibekit log "<message>"` | Append a dated changelog entry (newest on top). |
| `vibekit prune` | Remove `[DONE]` entries except the 5 most recent. |
| `vibekit packs add <name>` | Insert a pack block into `AGENTS.md`. |
| `vibekit packs remove <name>` | Remove a pack block from `AGENTS.md`. |
| `vibekit sync` | Mirror `AGENTS.md` to `CLAUDE.md`, `.windsurfrules`, `.github/copilot-instructions.md`. |

> **About `sync`:** most modern tools (Copilot, Cursor, Windsurf) now read
> `AGENTS.md` natively. `sync` is a fallback for tools/older setups that don't
> yet, or for teams who want the explicit native filename present.

---

## License

[MIT](./LICENSE)
