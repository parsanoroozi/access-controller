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
## 🛡️ **JWT Validation and DB Checks**

— Fast Local Validation with Clear Exceptions —

## 🧭 **Contents**

- What You’re Doing Now
- Why This Matters
- JWT Validation Checklist
- JWTs Are Self-Contained
- When You Still Need the DB
- How It Should Work

What You’re Doing Now

- You have `jwtService.validateToken()`
- After that, you query the database for extra info (user, roles, etc.)

Why This Matters

You are mixing local JWT validation with DB checks that are not always necessary.

Standard approach

- JWT access token → validate locally (fast, no DB round-trip)
- Opaque token → validate via IAM `/introspect`

JWT Validation Checklist

- `iss` — issued by your IAM
- `aud` — intended for your API
- `exp` / `nbf` / `iat` — time-based claims valid
- `sub` — user/account ID present
- `client_id` — matches registered client (if applicable)
- `scope` — required permissions present
- `alg` + `kid` — signature algorithm/key are correct
- `jti` — optional: enable revoke/blacklist

Plain words

- If IAM issues JWTs: validate signature + claims; no DB lookup needed
- If IAM issues opaque tokens: call `/introspect` to validate

JWTs Are Self-Contained

```text
sub = user/account ID
client_id = requesting client
scope = allowed actions
```

Resource server flow

1. Verify signature (ensure IAM issued token)
2. Verify claims (`exp`, `iss`, `aud`, ...)
3. If checks pass → token is authentic and untampered → no DB needed for validation

When You Still Need the DB

- First-time login/registration (at issuance time)
- Revocation/blacklist (e.g., early logout via `jti`)
- Extra application data not in token (e.g., profile details)
- Dynamic authorization: whether resource belongs to client; whether account has access

How It Should Work

During `/token`

- IAM verifies user credentials and client association
- IAM embeds `sub` and `client_id` in the JWT

At the resource server

- Validate token locally
- Use DB/cache only for dynamic authorization data (roles/resources) that cannot be safely embedded in the token