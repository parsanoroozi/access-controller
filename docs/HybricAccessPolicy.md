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
## 🔄 **Hybrid Access Policy (Token Claims + DB/Cache)**

— Balancing Stateless JWTs with Scalable Lookups —

## 🧭 **Contents**

- Handling Missing Resource Lists in JWT
- Proposed Hybrid Flow
- Why This Approach Works
- Implementation Notes

1. Handling Missing Resource Lists in JWT

- If a resources list is absent, check for null or empty before iterating
- Common libraries (`io.jsonwebtoken`, `nimbus-jose-jwt`) return null for missing claims; no exception if handled

Java example

```java
List<String> allowedResources = jwtService.getClaim(token, "resources");
if (allowedResources != null) {
    // check access using token
} else {
    // fallback to DB/cache lookup
}
```

2. Proposed Hybrid Flow

Token issuance

- If allowed resources ≤ 100 → embed resource IDs + actions in JWT claims
- If more than 100 → skip embedding; leave claim null to control token size

Access check

- If claim present → check statelessly from token
- If claim missing → query DB/cache for allowed resources and check

3. Why This Approach Works

| Aspect | Alignment with Best Practices |
|--------|-------------------------------|
| Stateless JWT validation | No DB hit when list is in token |
| Scalable fallback | DB/cache used only when needed |
| Token size control | Avoids oversized headers/cookies |
| ABAC-friendly | `resourceId:action` pairs enable fine-grained checks |
| Standard pattern | Mirrors Keycloak/Okta hybrids (scopes-in-token + DB/PDP) |

4. Implementation Notes

- Use a separate `resources` claim with an array of `{id, action}` objects
- Cache DB lookups when fallback occurs frequently
- On token refresh, reevaluate whether to include the list
- Always validate `sig`, `exp`, `iss`, `aud` before using claims

Conclusion

This hybrid keeps JWT validation fast and stateless when possible while remaining scalable and standards-aligned when the authorization graph is large.