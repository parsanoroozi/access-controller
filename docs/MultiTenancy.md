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
## 🏢 **Multi-Tenancy Defense-in-Depth**

— Isolation Strategies for SaaS IAM —

## 🧭 **Contents**

- What Multi-Tenancy Means
- Data Isolation (RLS vs Schemas vs DB-per-tenant)
- Token & Claim Isolation
- Network and Cache Isolation
- Tenant-Aware Authorization

What Multi-Tenancy Means

- Multiple clients/companies use the same IAM instance
- Each tenant has separate accounts, resources, and roles
- Prevent any cross-tenant data access or leakage

Data Isolation

1) Row-Level Security (single DB)

- Add `tenant_id` to every table and filter every query

```sql
SELECT * FROM accounts WHERE tenant_id = ?
```

- Pros: cost-efficient, simpler operations
- Cons: requires strict discipline and automated guards

2) Separate Schemas (per-tenant schema)

- Each tenant has its own schema within the same DB
- Pros: stronger logical isolation, shared hardware
- Cons: migrations require per-schema orchestration

3) Database per Tenant

- Each tenant has its own database
- Pros: strongest isolation, easy per-tenant backup/restore
- Cons: higher operational cost and complexity

Token & Claim Isolation

- Always include `tenant_id` (and optionally `tenant_name`) in JWT claims
- Verify the token’s `tenant_id` against requested resources
- Scope names can be tenant-scoped, e.g., `acme:invoice.read`

Network and Cache Isolation

- Use tenant-aware cache keys: `tenant:{id}:resource:{id}`
- Partition queues/topics by tenant when needed
- Consider VPC or namespace isolation for large/regulated tenants

Tenant-Aware Authorization

- Every authorization check must include tenant context
- Example: role and resource resolution filtered by `tenant_id`

Analogy

- Each company has its own locked drawer; keys never open another tenant’s drawer
