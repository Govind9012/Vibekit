<div align="center">

<h1>⚡ Vibekit</h1>

<p><strong>Maximum AI accuracy. Minimum tokens. Built-in security.</strong><br/>
The context layer for vibe coders who ship fast and stay grounded.</p>

[![npm version](https://img.shields.io/npm/v/@govindchaudhary%2Fvibekit.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@govindchaudhary/vibekit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](https://nodejs.org)

</div>

---

## What is Vibekit?

Vibe coding — letting an AI assistant drive most of the code while you steer — is fast. But it has a reliability problem: **every new chat session starts blind**. The AI guesses your stack, re-debates decisions you already made, misses your conventions, and ignores your security requirements. The result is inconsistent code, security gaps, and wasted tokens re-explaining context that should be permanent.

**Vibekit solves this with 3 persistent markdown files** that any AI tool reads automatically — no per-feature specs, no token-heavy frameworks, no setup ceremony. Your AI assistant always knows your stack, your conventions, your active principles, and your recent changes. It stays grounded even as you move fast.

> **Motto:** *vibe fast, stay grounded.*
> The built-in `Verify-before-trust` rule keeps your AI treating changelog notes as hints and the actual code as ground truth — so it never confidently hallucinates based on stale notes.

---

## Why Vibekit?

| Problem with raw vibe coding | How Vibekit fixes it |
|---|---|
| AI re-asks about your stack every session | `AGENTS.md` answers it once, permanently |
| AI re-debates decisions you already made | `DECISIONS.md` records them — never re-litigated |
| AI misses recent changes and introduces regressions | `CHANGELOG.md` keeps last N changes visible |
| AI skips security concerns in fast-paced work | `security` pack injects OWASP principles into every session |
| Token costs grow as you paste context repeatedly | One small file — loaded once, covers everything |
| Context differs between Copilot, Claude, Cursor, Windsurf | Single `AGENTS.md` — all tools read it natively |

---

## Quickstart — under 2 minutes

```bash
npx @govindchaudhary/vibekit init
```

Answer **one question** ("What's this project mostly?") and Vibekit creates four files in your current directory:

| File | Purpose | Read by AI? |
|---|---|---|
| `AGENTS.md` | Stack, conventions, active principle packs | ✅ Yes — automatically |
| `CHANGELOG.md` | Rolling log of recent changes | ✅ Yes — automatically |
| `DECISIONS.md` | Architecture decisions not to re-debate | ✅ Yes — automatically |
| `principles-catalog.md` | Human menu of available packs | ❌ No — docs only |

Then fill in the `Project Stack` and `Conventions` sections of `AGENTS.md` once. That's it. Every AI session from that point forward has full, accurate context.

---

## Achieving near-100% AI accuracy

Accuracy degrades when the AI works from incomplete or stale context. Vibekit eliminates the three root causes:

### 1. Stable context — `AGENTS.md`
The single file your AI reads every session. It contains:
- Your **project stack** (languages, frameworks, key libraries)
- Your **conventions** (naming, indentation, testing approach — specific and verifiable)
- Your **active principle packs** (coding rules injected directly into the AI's working context)
- The **Verify-before-trust** safeguard, which instructs the AI to check actual code before trusting any note

**Rule:** keep this file accurate. Wrong context is worse than no context.

### 2. Rolling changelog — `CHANGELOG.md`
Every time you make a meaningful change, log it:
```bash
vibekit log "Replaced JWT with session cookies — auth.ts, middleware/session.ts"
```
The AI sees recent history without you re-explaining it. Entries older than 5 resolved `[DONE]` items are pruned automatically so the file stays lean.

### 3. Decision log — `DECISIONS.md`
When you make an architecture call, write it down:
```markdown
### 2026-06-28 — Use Prisma over raw SQL
Chose Prisma for type-safe queries and migration management.
Revisit only if query performance becomes a bottleneck.
```
The AI will never propose switching back to raw SQL, never suggest a library you already evaluated and rejected.

### The Verify-before-trust rule
Baked into every `AGENTS.md` Vibekit creates:

> *Treat CHANGELOG.md and DECISIONS.md as hints, not ground truth. Before relying on an entry, confirm the referenced file/function still matches what's described. If it doesn't, the current code is the source of truth — not the note.*

This one rule prevents the most common AI hallucination pattern: confidently reasoning from an outdated note.

---

## Token efficiency

| Approach | Tokens per session | Accuracy |
|---|---|---|
| Paste full spec + plan + tasks per feature | ~4,000–15,000 | Variable — AI reasons from bloated docs |
| Vibekit (3 files, kept lean) | ~500–1,500 | High — focused, current, verifiable context |
| No context at all | ~0 | Low — AI guesses |

Vibekit's files are deliberately size-constrained:
- `AGENTS.md` — one concise file, never grows unbounded
- `CHANGELOG.md` — capped at ~10 active entries; `vibekit prune` keeps it lean
- `DECISIONS.md` — architecture decisions only, not routine changes

---

## Built-in security for vibe-coded apps

Vibe coding's biggest risk is shipping insecure code fast. The **`security` pack** injects OWASP-aligned principles directly into `AGENTS.md` so the AI applies them automatically — without you having to remind it every session.

```bash
vibekit packs add security
```

Active principles injected into every AI session:

| Principle | What it prevents |
|---|---|
| Never trust user input — validate at every boundary | Injection attacks, unexpected state |
| No secrets in code — use env vars; never commit `.env` | Credential leaks in version control |
| Auth vs authZ are separate concerns | Broken access control (OWASP #1) |
| Parameterized queries only | SQL injection |
| Least privilege for services/tokens/roles | Blast radius reduction on breach |
| Assume breach — log anomalies, never log PII/secrets | Sensitive data exposure in logs |
| Server-side validation is security; client-side is UX | Client-side bypass attacks |

Once the `security` pack is active, your AI assistant applies these rules automatically when writing auth flows, API handlers, database queries, and any user-facing code.

---

## Principle packs

Packs are reusable blocks of coding principles that live inside `AGENTS.md` between start/end markers. The AI reads them every session. Add only the packs relevant to your project — fewer packs = fewer tokens.

### Built-in packs

| Pack | Best for | Key principles |
|---|---|---|
| `core` | Every project *(always included)* | SRP, DRY, KISS, fail fast |
| `dev` | Application / backend development | SOLID (Open/Closed, LSP, ISP, DIP) |
| `data-eng` | Pipelines, ETL/ELT, analytics | Idempotency, schema validation, ETL separation, immutability |
| `security` | Any project with auth, APIs, or user data | OWASP principles, no secrets in code, parameterized queries |

### Managing packs

```bash
# Add a pack
vibekit packs add security
vibekit packs add data-eng

# Remove a pack you no longer need
vibekit packs remove dev
```

### Creating a custom pack

1. Create `packs/<name>.md` with your principles inside start/end markers:

   ```markdown
   <!-- pack:observability:start -->
   ### Observability Principles
   - Log at system boundaries, not inside loops
   - Every external call needs a timeout and a logged failure path
   - Structured logs only — no free-text log messages in production
   <!-- pack:observability:end -->
   ```

2. Activate it:
   ```bash
   vibekit packs add observability
   ```

See [`principles-catalog.md`](./principles-catalog.md) for the full pack menu and descriptions.

---

## CLI reference

| Command | What it does |
|---|---|
| `vibekit init` | Scaffold `AGENTS.md`, `CHANGELOG.md`, `DECISIONS.md`, `principles-catalog.md` in one step. |
| `vibekit log "<message>"` | Append a dated entry to `CHANGELOG.md` (newest on top, ISO date). |
| `vibekit prune` | Remove `[DONE]` changelog entries, keeping the 5 most recent resolved ones. |
| `vibekit packs add <name>` | Insert a pack block into `AGENTS.md` and update the active packs line. |
| `vibekit packs remove <name>` | Remove a pack block from `AGENTS.md`. |
| `vibekit sync` | Mirror `AGENTS.md` → `CLAUDE.md`, `.windsurfrules`, `.github/copilot-instructions.md`. |

> **About `vibekit sync`:** Most modern tools (GitHub Copilot, Cursor, Windsurf) now read `AGENTS.md` natively. `sync` is a fallback for tools or older setups that use their own native filenames, or for teams who want all native filenames present simultaneously.

---

## Two ways to adopt Vibekit

**(a) GitHub Template — zero install, new projects**

Click **"Use this template"** at the top of this repo to clone the full Vibekit structure into a brand-new repository. Then fill in your `AGENTS.md` stack and conventions.

**(b) npx CLI — add to an existing project**

```bash
cd your-existing-project
npx @govindchaudhary/vibekit init
```

Drops the 4 files into any existing repo without touching your code.

---

## Vibekit vs. alternatives

| | Vibekit | SDD tools (Spec-Kit, BMAD) | No context |
|---|---|---|---|
| Setup time | < 2 minutes | 15–60 minutes | 0 (but accuracy suffers) |
| Files per feature | 0 — 3 persistent files total | 3+ per feature (spec, plan, tasks) | 0 |
| Token overhead per session | Low (~500–1,500) | High (4,000–15,000+) | Zero |
| Security guidance | ✅ Built-in pack | ❌ Not included | ❌ |
| Keeps AI grounded | ✅ Verify-before-trust rule | Varies | ❌ |
| Best for | Solo devs, small teams, vibe coders | Large teams needing auditable specs | Throwaway scripts |

---

## Recommended workflow

```bash
# Day 1 — initialize
npx @govindchaudhary/vibekit init
# → fill in AGENTS.md: Project Stack + Conventions sections

# Add security if your project has auth/APIs/user data
vibekit packs add security

# During development — log every meaningful change
vibekit log "Added rate limiting to /api/auth — middleware/rateLimit.ts"
vibekit log "Switched from JWT to httpOnly session cookies — security decision"

# When a change is complete, mark it done
# Edit CHANGELOG.md: add [DONE] to the entry

# Periodically keep the changelog lean
vibekit prune

# If you use Claude, Cursor, or Windsurf with their native filenames
vibekit sync
```

---

## Contributing

Contributions are welcome — especially new principle packs. To add a pack:

1. Fork the repo and create a branch.
2. Add `packs/<name>.md` with your principles inside `<!-- pack:<name>:start/end -->` markers.
3. Update [`principles-catalog.md`](./principles-catalog.md) with a description.
4. Open a PR with a short explanation of who the pack is for and why the principles matter.

Please keep pack principles **specific, verifiable, and actionable** — not vague advice like "write clean code".

---

## License

[MIT](./LICENSE) © 2026 Vibekit contributors


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
