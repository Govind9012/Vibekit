<!-- pack:data-eng:start -->
### Data Engineering Principles
- Idempotency: re-running a job with the same input must not duplicate side effects
- Validate at the boundary: enforce schema on ingestion, fail loudly on mismatch — never silently coerce
- Separate Extract / Transform / Load: don't mix stages in one function
- Immutable raw data: never mutate ingested source data; transformations always produce new datasets
- Reproducibility: every run should be deterministic and log enough (row counts, versions, timestamps) to debug without re-running
<!-- pack:data-eng:end -->
