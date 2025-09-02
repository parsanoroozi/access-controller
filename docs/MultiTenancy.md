# Multi-Tenancy Defense-in-Depth

---

### 🏢 What Multi-Tenancy Means

* Multiple clients/companies use the **same IAM** instance.

**Example:**

* You host IAM for **Company A** and **Company B**
* Each has its own **accounts, resources, and roles**
* You must ensure **no cross-leakage** happens

---

### 🔹 Key Points

**1. Row-Level Security or Per-Tenant Schemas**

* When storing data in the database, make sure **Company A cannot see Company B’s rows**
* Approaches:
    * **Add a `tenant_id` column** and filter every query:
      ```sql
      SELECT * FROM accounts WHERE tenant_id = ?
      ```  
    * **Separate schemas or databases** per tenant

---

### 💡 Analogy

* Think of it as **each company having its own locked drawer**.
* Data is isolated, access is strictly controlled.
