# Principles Catalog

> A human-readable menu of the principle packs Vibekit ships with.
>
> **This file is pure documentation.** It is copied into your repo for reference
> only and is **never loaded or referenced by any AI assistant**. The packs that
> AI actually reads live inside `AGENTS.md`. Use this catalog to decide which
> packs to add via `vibekit packs add <name>`.

---

## How to read this

Each pack below maps 1:1 to a file in `packs/<name>.md`. When a pack is active,
its block is inserted into `AGENTS.md` between markers like
`<!-- pack:<name>:start -->` and `<!-- pack:<name>:end -->`.

To add a pack:

```bash
vibekit packs add dev
```

To remove one:

```bash
vibekit packs remove data-eng
```

---

## Available packs

### `core` — Core Principles *(included by default)*

Foundational rules that apply to almost any codebase.

- **Single Responsibility** — one function/module does one job
- **DRY** — don't duplicate logic, extract shared code
- **KISS** — simplest solution that meets the requirement; no premature abstraction
- **Fail fast** — validate inputs early, raise clear errors instead of failing silently

### `dev` — SOLID Principles

For general application/software development.

- **Open/Closed** — extend behavior with new code; don't modify working code to add a feature
- **Liskov Substitution** — a subtype must be usable anywhere its base type is, without surprises
- **Interface Segregation** — small focused interfaces beat one large general-purpose one
- **Dependency Inversion** — depend on abstractions, not concrete implementations

### `security` — Security Principles

For any project handling user input, auth, APIs, or stored data — especially relevant for fast vibe-coded apps.

- **Never trust user input** — validate and sanitize at every boundary: client, API, and database layer
- **No secrets in code** — use environment variables; never commit `.env` files
- **Auth vs authZ** — authentication (who you are) and authorization (what you can do) are separate concerns
- **Parameterized queries only** — never concatenate user input into SQL or shell commands
- **Least privilege** — services, tokens, and DB roles get only the minimum access they need
- **Assume breach** — log enough to detect anomalies, but never log passwords, tokens, PII, or secrets
- **Validate on the server** — client-side validation is UX; server-side is security; never rely on only one

### `data-eng` — Data Engineering Principles

For pipelines, ETL/ELT, and analytics engineering.

- **Idempotency** — re-running a job with the same input must not duplicate side effects
- **Validate at the boundary** — enforce schema on ingestion, fail loudly on mismatch; never silently coerce
- **Separate Extract / Transform / Load** — don't mix stages in one function
- **Immutable raw data** — never mutate ingested source data; transformations always produce new datasets
- **Reproducibility** — every run should be deterministic and log enough (row counts, versions, timestamps) to debug without re-running

---

## Adding your own custom pack

1. Create a new file in `packs/`, e.g. `packs/observability.md`.
2. Wrap its content in start/end markers matching the file name:

   ```markdown
   <!-- pack:observability:start -->
   ### Observability Principles
   - Log at boundaries, not inside loops
   - Every external call should have a timeout and a logged failure path
   <!-- pack:observability:end -->
   ```

3. Activate it:

   ```bash
   vibekit packs add observability
   ```

The marker name (`observability`) must match the file name (`observability.md`).
