Access Control
Overview

This document explains how access control is implemented in your IAM system, aligning with modern IAM standards like ABAC (Attribute-Based Access Control) and scope-based authorization in OAuth2.

1. Problem with String-Only Resource Checks

Current implementation:

account.getRole().getResources()
.stream()
.map(Resource::getName)
.anyMatch(name -> name.equals(request.getResourceName()));


Issues:

Only checks resource name, ignoring:

Action (read, write, admin)

Resource type (api-endpoint, web-page)

Context/environment (time, IP, tenant, etc.)

Brittle: small changes in resource naming break authorization.

Coarse RBAC: not ABAC or policy-based.

2. Your Current Design

Clients → define resources on registration:

{
"id": 123,
"name": "invoice",
"type": "api-endpoint",
"url": "/invoices",
"action": "read"
}


Roles → have a list of resources.

Accounts → belong to a role.

This allows action-aware checks:

resource.getName().equals(requestedResourceName) &&
resource.getAction().equals(requestedAction)

3. Alignment with Best Practices

Scope-based (OAuth2)

Tokens include permissions like invoice:read, invoice:write.

Can generate a scope claim in JWT for allowed actions.

ABAC / Policy-based (Keycloak, Okta, OPA/Rego, Cedar)

Evaluate access using attributes:

Subject → user role, groups, tenant

Resource → type, owner, url, action

Environment → time, IP, device
✅ Your current design is ABAC-ready.

4. Concrete Improvements
   a) Simple ABAC

Request payload:

{
"resourceName": "invoice",
"resourceAction": "read"
}


Authorization check:

boolean allowed = account.getRole().getResources().stream()
.anyMatch(r -> r.getName().equals(request.getResourceName())
&& r.getAction().equals(request.getAction()));


Optional: include type and/or url for finer-grained checks.

Avoid brittle string-only checks.

b) JWT Scopes (Optional Optimization)

Encode allowed actions in token:

"scope": ["invoice:read", "invoice:write", "user:update"]


Resource servers check if requestedResource:requestedAction exists in scope claim.

Reduces DB/cache lookups → supports stateless resource servers.

c) Policy-Based ABAC (Advanced)

Implement a Policy Decision Point (PDP), e.g., OPA/Rego or Cedar.

Example rule:

allow if:
user.role in resource.allowedRoles
AND resource.type = requestedType
AND resource.action = requestedAction
AND env.ip in allowedIps
AND env.time within officeHours


Your Client → Resources → Role → Account structure works well for feeding a PDP.

5. Architecture Assessment

Pros:

Resources include action, type, url → ABAC-ready.

Roles aggregate resources → fine-grained RBAC → can generate scopes.

Clients register resources → supports multi-tenant authorization.

Improvements:

Encode permissions/scopes in JWT for stateless checks.

Cache resource mappings (role → resources) for high-performance checks.

Consider PDP for environment/context-aware policies.

Always match name + action (+ optional type/url) instead of just name.

✅ Bottom line:

Your architecture aligns with modern IAM patterns.

Effectively implements ABAC over RBAC.

Missing pieces for full standard alignment:

Encode scopes in tokens (stateless access checks)

Use a PDP for dynamic, context-aware policies

References

OAuth 2.0 RFC 6749

OAuth 2.0 Security Best Current Practice

OpenID Connect Core

ABAC and Policy-Based Access Control Concepts
