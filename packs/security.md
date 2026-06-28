<!-- pack:security:start -->
### Security Principles
- Never trust user input: validate and sanitize at every boundary — client, API, and database layer
- No secrets in code: use environment variables for credentials, keys, and tokens; never commit `.env` files
- Auth vs authZ: authentication (who you are) and authorization (what you can do) are separate concerns — implement both
- Parameterized queries only: never concatenate user input into SQL or shell commands — use prepared statements or an ORM
- Least privilege: services, API tokens, and DB roles get only the minimum access they need, nothing more
- Assume breach: log enough to detect and audit anomalies, but never log passwords, tokens, PII, or secrets
- Validate on the server: client-side validation is UX; server-side validation is security — never rely on only one
<!-- pack:security:end -->
