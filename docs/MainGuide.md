<style>
  :root {
    /*--bg: #000000;*/
    --text: #e6e6e6;
    --muted: #a0aec0;
    --accent: #85EA2D;
    --accent-2: #6CBF00;
    --accent-3: #4CAF50;
    --success: #85EA2D;
    --warning: #F59E0B;
    --danger: #EF4444;
    --code-bg: #0d1117;
    --code-border: #2a2f36;
    --table-border: #2a2f36;
    --blockquote-bg: #0f1a12;
    --blockquote-border: #85EA2D;
  
  /* Force dark theme */
  :root { --bg: #121212; --text: #e6e6e6; --muted: #a0aec0; --accent: #85EA2D; --accent-2: #6CBF00; --accent-3: #4CAF50; --success: #85EA2D; --warning: #F59E0B; --danger: #EF4444; --code-bg: #0d1117; --code-border: #2a2f36; --table-border: #2a2f36; --blockquote-bg: #0f1a12; --blockquote-border: #85EA2D; }
  body { background: var(--bg); color: var(--text); font-family: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial; font-size: 72px; line-height: 2.0; letter-spacing: 0.15px; }
  h1 { font-size: 4.5em; font-weight: 800; color: var(--text); margin-top: 0.6em; border-bottom: 2px solid var(--table-border); padding-bottom: 0.25em; }
  h2 { font-size: 3.6em; font-weight: 750; color: var(--accent); margin-top: 1.1em; }
  h3 { font-size: 2.8em; font-weight: 700; color: var(--accent-2); margin-top: 1em; }
  h4 { font-size: 2.2em; font-weight: 650; color: var(--accent-3); }
  p, li { font-weight: 500; }
  strong { font-weight: 800; color: var(--text); }
  em { color: var(--muted); }
  a { color: var(--accent); text-underline-offset: 3px; }
  ul, ol { margin: 0.5em 0 1em; }
  li { margin: 0.35em 0; }
  code { background: var(--code-bg); border: 1px solid var(--code-border); padding: 0.25em 0.55em; border-radius: 6px; font-size: 1.2em; }
  pre { background: var(--code-bg); border: 1px solid var(--code-border); padding: 1.2em; border-radius: 10px; overflow: auto; box-shadow: 0 4px 14px rgba(0,0,0,0.25); }
  pre code { background: transparent; border: 0; padding: 0; font-size: 1.2em; }
  table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 1.2em; }
  th, td { border: 1px solid var(--table-border); padding: 10px 12px; text-align: left; }
  thead th { background: rgba(37, 99, 235, 0.08); color: var(--text); }
  tbody tr:nth-child(even) { background: rgba(148, 163, 184, 0.08); }
  blockquote { background: var(--blockquote-bg); border-left: 6px solid var(--blockquote-border); padding: 0.8em 1em; border-radius: 8px; color: var(--text); }
  .badge { display: inline-block; padding: 0.2em 0.6em; border-radius: 999px; font-size: 0.8em; font-weight: 700; }
  .badge.info { background: rgba(37,99,235,0.12); color: var(--accent); }
  .badge.success { background: rgba(16,185,129,0.12); color: var(--success); }
  .badge.warn { background: rgba(245,158,11,0.12); color: var(--warning); }
  .badge.danger { background: rgba(239,68,68,0.12); color: var(--danger); }
  .callout { border-left: 6px solid var(--accent); background: rgba(37,99,235,0.08); padding: 0.9em 1em; border-radius: 8px; margin: 1em 0; }
  .callout.warning { border-color: var(--warning); background: rgba(245,158,11,0.08); }
  .callout.success { border-color: var(--success); background: rgba(16,185,129,0.08); }
  .callout.danger { border-color: var(--danger); background: rgba(239,68,68,0.08); }
</style>
## 📘 **Access Control and Token Best Practices**

— Concise Playbook for Resource Servers and IAM —

## 🧭 **Contents**

- Token Generation
- Client Secret Handling
- Minimize DB Hits
- Extract Data from JWT
- Resource Checks
- Efficient DB Access
- Standardized Response Payload
- Logging Practices
- Client Types
- JWT Signing & Verification
- Client Credentials
- Token Content & Updates
- Key Management
- Takeaways

1. Token Generation

- Generate tokens only at the `/token` endpoint
- Do not create a new token for every API request

2. Client Secret Handling

- Never send client secrets in the body
- Use Authorization header (Basic) for client authentication
- Prefer `access_token + resourceId` instead of secrets in requests

3. Minimize DB Hits

- Put as much information as possible into the JWT to avoid frequent DB lookups
- JWT claims enable stateless validation

4. Extract Data from JWT

- Avoid sending `clientId`, `clientSecret`, or `username` in the body
- Extract from JWT claims instead

5. Resource Checks

- Do not rely on resource name alone
- Verify full attributes: id, name, action, url, type
- Use JWT claims when possible; fallback to DB/cache only if needed

6. Efficient DB Access

- Avoid loading entire collections and iterating in code
- Use repository queries to let the DB filter and check
- Always handle nulls safely

7. Standardized Response Payload

Use a structured decision model:

```json
{
  "decision": "Permit",
  "authenticated": true,
  "obligations": [{ "type": "reauth", "reason": "token_expiring" }],
  "advice": [{ "message": "Use scope invoice.read" }],
  "policyId": "rbac-resource-v3",
  "reason": "role lacks invoice:write"
}
```

8. Logging Practices

- Avoid leaking sensitive signals
- Keep private information secure

9. Client Types

- Distinguish public vs confidential clients
- Do not issue refresh tokens to public clients

JWT Signing & Verification

- Use RSA keys; keep private key in IAM, expose public key at `/jwks`
- Flow: IAM creates claims → signs JWT → resource servers verify with `/jwks`
- JWTs are Base64-encoded, not encrypted; clients can decode claims
- Typical access token lifetime: 5–15 minutes

Client Credentials

- Both `clientId` and `clientSecret` are generated by IAM
- `clientSecret` is used only at `/token` to obtain access/refresh/ID tokens

Token Content & Updates

- Include as much info in JWT as feasible to reduce DB hits
- Invalidate old tokens when permissions change; prompt clients to refresh
- Suggested approach:
  - ≤100 allowed resources → embed list in token (id, name, action, url, type, description)
  - >100 allowed resources → leave list empty; use DB/cache fallback

Key Management

- One IAM key pair is sufficient; no need per-client key pairs

Takeaways

- JWT enables stateless access control
- Resource servers can check allowed resources via token claims
- Combine JWT claims + DB/cache fallback for dynamic and large-scale access