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
  }
  body { 
    background: var(--bg); 
    color: var(--text); 
    font-family: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; 
    font-size: 72px; 
    line-height: 2.0; 
    letter-spacing: 0.15px;
  }
  h1 { font-size: 3.5em; font-weight: 800; color: var(--text); margin-top: 0.6em; border-bottom: 2px solid var(--table-border); padding-bottom: 0.25em; }
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
# 🔐 Access Control

— Modern IAM Patterns with ABAC and OAuth2 Scopes —

## 🧭 **Contents**

- Overview
- Problems with String-Only Checks
- Current Design (Clients → Resources → Roles → Accounts)
- Alignment with Best Practices
- Concrete Improvements
  - Simple ABAC
  - JWT Scopes
  - Policy-Based ABAC (PDP)
- Architecture Assessment
- References

Overview

This guide explains how access control works in the IAM and how to align it with ABAC (Attribute-Based Access Control) and OAuth2 scope-based authorization.

Problems with String-Only Checks

Current code (string-only):

```java
account.getRole().getResources()
    .stream()
    .map(Resource::getName)
    .anyMatch(name -> name.equals(request.getResourceName()));
```

Issues:

- Only matches resource name, ignoring action, type, and context
- Brittle: small naming changes break authorization
- Coarse RBAC; not ABAC/policy-based

Current Design

Clients define resources at registration, e.g.:

```json
{
  "id": 123,
  "name": "invoice",
  "type": "api-endpoint",
  "url": "/invoices",
  "action": "read"
}
```

Roles have a list of resources. Accounts belong to a role.

This enables action-aware checks:

```java
resource.getName().equals(requestedResourceName)
    && resource.getAction().equals(requestedAction);
```

Alignment with Best Practices

- Scope-based (OAuth2): use permissions like `invoice:read`, `invoice:write` in JWT
- ABAC / Policy-based (Keycloak, Okta, OPA/Rego, Cedar): evaluate attributes

Attributes to evaluate

| Dimension   | Examples                      |
|-------------|-------------------------------|
| Subject     | role, groups, tenant          |
| Resource    | type, owner, url, action      |
| Environment | time, IP, device              |

✅ The current design is ABAC-ready.

Concrete Improvements

Simple ABAC

Request payload:

```json
{
  "resourceName": "invoice",
  "resourceAction": "read"
}
```

Authorization check:

```java
boolean allowed = account.getRole().getResources().stream()
    .anyMatch(r -> r.getName().equals(request.getResourceName())
        && r.getAction().equals(request.getAction()));
```

Optional: include `type` and/or `url` for finer-grained checks.

JWT Scopes (Optional Optimization)

Encode allowed actions in token:

```json
{
  "scope": ["invoice:read", "invoice:write", "user:update"]
}
```

Resource servers check if `requestedResource:requestedAction` exists in the `scope` claim. This reduces DB/cache lookups and supports stateless resource servers.

Policy-Based ABAC (Advanced)

Introduce a Policy Decision Point (PDP), e.g. OPA/Rego or Cedar.

Pseudocode rule:

```
allow if
  user.role in resource.allowedRoles
  and resource.type = requestedType
  and resource.action = requestedAction
  and env.ip in allowedIps
  and env.time within officeHours
```

The Client → Resources → Role → Account structure feeds a PDP well.

Architecture Assessment

Pros

- Resources include action, type, url → ABAC-ready
- Roles aggregate resources → fine-grained RBAC → can generate scopes
- Clients register resources → supports multi-tenant authorization

Improvements

- Encode permissions/scopes in JWT for stateless checks
- Cache role → resources mappings for performance
- Consider a PDP for environment/context-aware decisions
- Always match name + action (+ optional type/url) instead of just name

Bottom Line

Your architecture aligns with modern IAM patterns and effectively implements ABAC over RBAC. To reach full alignment, add scopes to tokens for stateless checks and consider a PDP for dynamic, context-aware policies.

References

- OAuth 2.0 RFC 6749
- OAuth 2.0 Security Best Current Practice
- OpenID Connect Core
- ABAC and Policy-Based Access Control Concepts
