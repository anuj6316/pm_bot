# Chapter 5: Unity Catalog Bootstrap

## What You'll Learn in This Chapter

By the end of this chapter, you will:
- ✅ Understand Unity Catalog architecture and components
- ✅ Create and assign Unity Catalog metastore
- ✅ Create catalogs for dev, staging, and prod environments
- ✅ Create standard schemas (curated, certified_views, audit, genie_eval)
- ✅ Configure grants and permissions
- ✅ Verify Unity Catalog setup

**Estimated Time:** 4-5 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Advanced)

---

## 5.1 Unity Catalog Overview

### 📘 CONCEPT: What is Unity Catalog?

Unity Catalog is Databricks' unified governance layer for data and AI assets.

**Key Features:**
- **Centralized Metastore:** Single source of truth for all data assets
- **3-Level Namespace:** Catalog → Schema → Table/View
- **Unified Permissions:** One permission model for all assets
- **Data Lineage:** Track data flow from source to consumption
- **Audit Logging:** Complete audit trail of all access
- **Data Discovery:** Search and discover data assets

**Without Unity Catalog:**
```
Workspace 1 (Dev)
├── Hive Metastore
│   ├── default
│   └── custom_db
└── No centralized governance

Workspace 2 (Prod)
├── Hive Metastore
│   ├── default
│   └── custom_db
└── Separate permissions, no visibility

Problems:
- No cross-workspace visibility
- Inconsistent permissions
- Hard to track data lineage
- No audit logging
```

**With Unity Catalog:**
```
Unity Catalog Metastore
├── Catalog: genie_dev
│   ├── Schema: curated
│   ├── Schema: certified_views
│   ├── Schema: audit
│   └── Schema: genie_eval
├── Catalog: genie_staging
│   ├── Schema: curated
│   ├── Schema: certified_views
│   ├── Schema: audit
│   └── Schema: genie_eval
└── Catalog: genie_prod
    ├── Schema: curated
    ├── Schema: certified_views
    ├── Schema: audit
    └── Schema: genie_eval

Benefits:
✅ Centralized governance
✅ Consistent permissions
✅ Full data lineage
✅ Complete audit trail
✅ Cross-workspace visibility
```

---

### Unity Catalog Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                Unity Catalog Metastore              │
│  (One per Azure region, attached to workspaces)     │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │            Catalog: genie_dev               │   │
│  │  ┌─────────────────────────────────────┐    │   │
│  │  │   Schema: curated                   │    │   │
│  │  │   ├── Table: sales_transactions     │    │   │
│  │  │   ├── Table: customer_master        │    │   │
│  │  │   └── Table: product_catalogue      │    │   │
│  │  └─────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────┐    │   │
│  │  │   Schema: certified_views           │    │   │
│  │  │   ├── View: v_net_revenue_monthly   │    │   │
│  │  │   └── View: v_inventory_health      │    │   │
│  │  └─────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────┐    │   │
│  │  │   Schema: audit                     │    │   │
│  │  │   └── Table: access_logs            │    │   │
│  │  └─────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────┐    │   │
│  │  │   Schema: genie_eval                │    │   │
│  │  │   └── Table: accuracy_results       │    │   │
│  │  └─────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 5.2 Create Unity Catalog Metastore

### 📘 CONCEPT: What is a Metastore?

A metastore is the top-level container in Unity Catalog that:
- Stores all metadata about catalogs, schemas, tables, views
- Manages permissions and access control
- Tracks data lineage and audit logs
- Is attached to one or more workspaces

**Important:**
- One metastore per Azure region
- Can be shared across multiple workspaces
- Stored in Azure Data Lake Storage (ADLS) Gen2

---

### Metastore with Pulumi

```python
# infrastructure/unity_catalog.py
import pulumi
import pulumi_databricks as databricks

# Configuration
config = pulumi.Config()
env = config.get("environment") or "dev"
storage_url = config.require("storage_url")  # From Chapter 3 outputs

# Create Unity Catalog metastore
metastore = databricks.Metastore(
    "genie-metastore",
    name=f"genie-{env}-metastore",
    storage_root=storage_url,  # abfss://container@account.dfs.core.windows.net/
    region="eastus",  # Azure region
    owner="account users"  # Default owner group
)

pulumi.export("metastore_id", metastore.metastore_id)
pulumi.export("metastore_name", metastore.name)
```

---

### Attach Metastore to Workspace

```python
# Get current workspace ID (from data source)
current_workspace = databricks.get_current_workspace()

# Attach metastore to workspace
metastore_assignment = databricks.MetastoreAssignment(
    "genie-metastore-assignment",
    workspace_id=current_workspace.workspace_id,
    metastore_id=metastore.metastore_id,
    default_catalog_name="genie_catalog"
)

pulumi.export("metastore_assigned", True)
```

---

## 5.3 Create Catalogs

### 📘 CONCEPT: What is a Catalog?

A catalog is the second-level namespace in Unity Catalog (after metastore).

**Best Practices:**
- Separate catalogs by environment (dev, staging, prod)
- Use ISOLATED mode to prevent cross-catalog access
- Add descriptive comments for documentation
- Assign ownership to appropriate groups

---

### Catalog Creation Code

```python
# Create catalogs for each environment
catalogs = {}
for env_name in ["dev", "staging", "prod"]:
    catalog = databricks.Catalog(
        f"genie-{env_name}-catalog",
        name=f"genie_{env_name}",
        comment=f"{env_name.upper()} environment catalog for Genie project",
        isolation_mode="ISOLATED",  # Prevent cross-environment access
        metastore_id=metastore.metastore_id,
        opts=pulumi.ResourceOptions(
            depends_on=[metastore_assignment]  # Wait for metastore attachment
        )
    )
    catalogs[env_name] = catalog
    pulumi.export(f"{env_name}_catalog_name", catalog.name)
```

---

### Catalog Properties Explained

```python
catalog = databricks.Catalog(
    "genie-dev-catalog",
    
    # Logical name in Pulumi
    name="genie_dev",  # Actual name in Unity Catalog
    
    # Description shown in Databricks UI
    comment="Dev environment catalog for Genie project. " +
            "Contains curated tables, certified views, and evaluation data.",
    
    # ISOLATED: Only workspaces explicitly bound can access
    # OPEN: All attached workspaces can access
    isolation_mode="ISOLATED",
    
    # Metastore this catalog belongs to
    metastore_id=metastore.metastore_id,
    
    # Optional: Owner group (use AAD group name)
    owner="genie-dev-admins@company.com",
    
    # Optional: Custom properties
    properties={
        "environment": "dev",
        "project": "genie",
        "cost_center": "data-platform"
    }
)
```

---

## 5.4 Create Schemas

### 📘 CONCEPT: What is a Schema?

A schema (also called "database") is the third-level namespace in Unity Catalog.

**Standard Schema Pattern:**

| Schema | Purpose | Tables/Views |
|--------|---------|--------------|
| **curated** | Clean, validated source data | Raw tables from source systems |
| **certified_views** | Pre-built business logic | SQL views for complex KPIs |
| **audit** | Logging and monitoring | Access logs, query history |
| **genie_eval** | Genie training data | Accuracy results, benchmarks |

---

### Schema Creation Code

```python
# Standard schemas for each catalog
SCHEMA_NAMES = ["curated", "certified_views", "audit", "genie_eval"]
SCHEMA_COMMENTS = {
    "curated": "Clean, validated source data tables. Ready for analytics and reporting.",
    "certified_views": "Pre-built SQL views for complex business KPIs. Optimized for Genie queries.",
    "audit": "Audit logs and monitoring data. Tracks access patterns and query history.",
    "genie_eval": "Genie training and evaluation data. Stores accuracy benchmarks and Q&A examples."
}

schemas = {}
for env_name in ["dev", "staging", "prod"]:
    catalog = catalogs[env_name]
    schemas[env_name] = {}
    
    for schema_name in SCHEMA_NAMES:
        schema = databricks.Schema(
            f"genie-{env_name}-{schema_name}-schema",
            catalog_name=catalog.name,
            name=schema_name,
            comment=SCHEMA_COMMENTS[schema_name],
            opts=pulumi.ResourceOptions(
                parent=catalog,  # Logical grouping
                depends_on=[catalog]
            )
        )
        schemas[env_name][schema_name] = schema

# Export schema names
for env_name in ["dev", "staging", "prod"]:
    for schema_name in SCHEMA_NAMES:
        pulumi.export(
            f"{env_name}_{schema_name}_schema",
            schemas[env_name][schema_name].full_name
        )
```

---

### Full Schema Names

```
genie_dev.curated
genie_dev.certified_views
genie_dev.audit
genie_dev.genie_eval

genie_staging.curated
genie_staging.certified_views
genie_staging.audit
genie_staging.genie_eval

genie_prod.curated
genie_prod.certified_views
genie_prod.audit
genie_prod.genie_eval
```

---

## 5.5 Create Tables

### 📘 CONCEPT: Managed vs. External Tables

**Managed Tables:**
- Unity Catalog manages both metadata AND data files
- Data stored in metastore storage location
- Deleting table also deletes data files
- Best for: Most use cases, simpler management

**External Tables:**
- Unity Catalog manages metadata only
- Data stored in external location (your choice)
- Deleting table keeps data files
- Best for: Data sharing, existing data lakes

**For Genie:** Use managed tables for simplicity

---

### Sample Table: sales_transactions

```python
# infrastructure/tables.py
import pulumi_databricks as databricks

# Create table using SQL (most flexible approach)
sales_transactions_table = databricks.SqlTable(
    "sales-transactions-table",
    catalog_name=catalogs["dev"].name,
    schema_name=schemas["dev"]["curated"].name,
    name="sales_transactions",
    table_type="MANAGED",
    data_source_format="DELTA",
    
    # Table columns
    columns=[
        databricks.SqlTableColumnArgs(
            name="transaction_id",
            type_text="STRING",
            comment="Unique surrogate key for each transaction. Never null."
        ),
        databricks.SqlTableColumnArgs(
            name="transaction_date",
            type_text="TIMESTAMP",
            comment="Date the sale was completed (UTC). Use for time-series analysis."
        ),
        databricks.SqlTableColumnArgs(
            name="customer_id",
            type_text="STRING",
            comment="Foreign key to customer_master.customer_id"
        ),
        databricks.SqlTableColumnArgs(
            name="product_id",
            type_text="STRING",
            comment="Foreign key to product_catalogue.product_id"
        ),
        databricks.SqlTableColumnArgs(
            name="gross_amount",
            type_text="DECIMAL(18,2)",
            comment="Pre-discount gross sale value in USD. Never negative."
        ),
        databricks.SqlTableColumnArgs(
            name="discount_amount",
            type_text="DECIMAL(18,2)",
            comment="Total discount applied. Can be 0 but never negative."
        ),
        databricks.SqlTableColumnArgs(
            name="return_amount",
            type_text="DECIMAL(18,2)",
            comment="Value of goods returned. 0 for non-returned transactions."
        ),
        databricks.SqlTableColumnArgs(
            name="net_revenue",
            type_text="DECIMAL(18,2)",
            comment="Computed: gross_amount - discount_amount - return_amount. Preferred KPI for revenue reporting."
        ),
        databricks.SqlTableColumnArgs(
            name="region_code",
            type_text="STRING",
            comment="2-letter region code: NA, EU, APAC, LATAM"
        ),
        databricks.SqlTableColumnArgs(
            name="channel",
            type_text="STRING",
            comment="Sales channel: online, retail, partner, direct"
        )
    ],
    
    # Table comment (critical for Genie!)
    comment="Core transactional table containing one row per completed sale. " +
            "Use this table for revenue analysis, sales trend queries, and customer purchase history. " +
            "Net revenue = gross_amount minus discount_amount minus return_amount."
)
```

---

### Alternative: SQL Statement Execution

```python
# Execute SQL to create table
databricks.SqlExecution(
    "create-sales-table",
    warehouse_id=warehouse.id,
    statement="""
    CREATE TABLE IF NOT EXISTS genie_dev.curated.sales_transactions (
        transaction_id STRING COMMENT 'Unique surrogate key for each transaction',
        transaction_date TIMESTAMP COMMENT 'Date the sale was completed (UTC)',
        customer_id STRING COMMENT 'FK to customer_master.customer_id',
        product_id STRING COMMENT 'FK to product_catalogue.product_id',
        gross_amount DECIMAL(18,2) COMMENT 'Pre-discount gross sale value in USD',
        discount_amount DECIMAL(18,2) COMMENT 'Total discount applied',
        return_amount DECIMAL(18,2) COMMENT 'Value of goods returned',
        net_revenue DECIMAL(18,2) COMMENT 'Net revenue after discounts and returns',
        region_code STRING COMMENT '2-letter region code (NA, EU, APAC, LATAM)',
        channel STRING COMMENT 'Sales channel: online, retail, partner, direct'
    )
    COMMENT 'Core transactional table for sales analytics. Net revenue is the preferred KPI.'
    USING DELTA
    """,
    opts=pulumi.ResourceOptions(
        depends_on=[schemas["dev"]["curated"]]
    )
)
```

---

### Insert Sample Data

```python
# Insert sample data for testing
databricks.SqlExecution(
    "insert-sample-sales-data",
    warehouse_id=warehouse.id,
    statement="""
    INSERT INTO genie_dev.curated.sales_transactions
    VALUES
    ('TXN-001', '2024-01-15 10:30:00', 'CUST-001', 'PROD-001', 100.00, 10.00, 0.00, 90.00, 'NA', 'online'),
    ('TXN-002', '2024-01-15 11:45:00', 'CUST-002', 'PROD-002', 250.00, 25.00, 0.00, 225.00, 'EU', 'retail'),
    ('TXN-003', '2024-01-16 09:15:00', 'CUST-001', 'PROD-003', 75.00, 0.00, 75.00, 0.00, 'NA', 'online'),
    ('TXN-004', '2024-01-16 14:20:00', 'CUST-003', 'PROD-001', 100.00, 5.00, 0.00, 95.00, 'APAC', 'partner'),
    ('TXN-005', '2024-01-17 16:00:00', 'CUST-004', 'PROD-004', 500.00, 50.00, 0.00, 450.00, 'NA', 'direct')
    """
)
```

---

## 5.6 Configure Grants and Permissions

### 📘 CONCEPT: Unity Catalog Permissions Model

**Key Principles:**
1. **Secure by Default:** No access unless explicitly granted
2. **Privilege Inheritance:** Grants on catalog → schema → table
3. **Least Privilege:** Grant minimum necessary access
4. **Role-Based Access Control (RBAC):** Use groups, not individuals

---

### Permission Types

| Privilege | Catalog | Schema | Table | View |
|-----------|---------|--------|-------|------|
| **USE** | ✅ | ✅ | ❌ | ❌ |
| **CREATE** | ✅ | ✅ | ❌ | ❌ |
| **SELECT** | ❌ | ❌ | ✅ | ✅ |
| **MODIFY** | ❌ | ❌ | ✅ | ✅ |
| **MANAGE** | ✅ | ✅ | ✅ | ✅ |

---

### Grant Permissions with Pulumi

```python
# infrastructure/grants.py

# Grant USE on catalog to all users
databricks.Grants(
    "catalog-use-grant",
    catalog=catalogs["dev"].name,
    grants=[
        databricks.GrantsGrantArgs(
            principal="account users",  # All authenticated users
            privileges=["USE_CATALOG"]
        )
    ]
)

# Grant USE on schemas to all users
databricks.Grants(
    "schema-use-grant",
    schema=databricks.SchemaArgs(
        catalog_name=catalogs["dev"].name,
        name="curated"
    ),
    grants=[
        databricks.GrantsGrantArgs(
            principal="account users",
            privileges=["USE_SCHEMA"]
        )
    ]
)

# Grant SELECT on curated tables to analysts
databricks.Grants(
    "curated-table-select-grant",
    schema=databricks.SchemaArgs(
        catalog_name=catalogs["dev"].name,
        name="curated"
    ),
    grants=[
        databricks.GrantsGrantArgs(
            principal="genie-analysts",  # AAD group
            privileges=["SELECT", "USE_SCHEMA"]
        )
    ]
)

# Grant MODIFY to data engineers
databricks.Grants(
    "curated-table-modify-grant",
    schema=databricks.SchemaArgs(
        catalog_name=catalogs["dev"].name,
        name="curated"
    ),
    grants=[
        databricks.GrantsGrantArgs(
            principal="genie-engineers",  # AAD group
            privileges=["SELECT", "MODIFY", "USE_SCHEMA"]
        )
    ]
)
```

---

### Table-Level Grants

```python
# Grant specific table access
databricks.Grants(
    "sales-table-select-grant",
    table=databricks.TableArgs(
        catalog_name=catalogs["dev"].name,
        schema_name="curated",
        name="sales_transactions"
    ),
    grants=[
        databricks.GrantsGrantArgs(
            principal="genie-analysts",
            privileges=["SELECT"]
        ),
        databricks.GrantsGrantArgs(
            principal="genie-engineers",
            privileges=["SELECT", "MODIFY"]
        )
    ]
)
```

---

### Role-Based Access Matrix

```python
# Define RBAC roles
ROLES = {
    "genie-admins": {
        "catalog": ["USE_CATALOG", "CREATE_SCHEMA", "MANAGE"],
        "schema": ["USE_SCHEMA", "CREATE_TABLE", "MANAGE"],
        "table": ["SELECT", "MODIFY", "MANAGE"]
    },
    "genie-engineers": {
        "catalog": ["USE_CATALOG"],
        "schema": ["USE_SCHEMA", "CREATE_TABLE"],
        "table": ["SELECT", "MODIFY"]
    },
    "genie-analysts": {
        "catalog": ["USE_CATALOG"],
        "schema": ["USE_SCHEMA"],
        "table": ["SELECT"]
    },
    "genie-viewers": {
        "catalog": ["USE_CATALOG"],
        "schema": ["USE_SCHEMA"],
        "table": ["SELECT"]  # Read-only on specific tables
    }
}

# Apply grants for each role
for role_name, privileges in ROLES.items():
    # Catalog grants
    if "catalog" in privileges:
        databricks.Grants(
            f"{role_name}-catalog-grant",
            catalog=catalogs["dev"].name,
            grants=[
                databricks.GrantsGrantArgs(
                    principal=role_name,
                    privileges=privileges["catalog"]
                )
            ]
        )
    
    # Schema grants
    if "schema" in privileges:
        for schema_name in SCHEMA_NAMES:
            databricks.Grants(
                f"{role_name}-{schema_name}-schema-grant",
                schema=databricks.SchemaArgs(
                    catalog_name=catalogs["dev"].name,
                    name=schema_name
                ),
                grants=[
                    databricks.GrantsGrantArgs(
                        principal=role_name,
                        privileges=privileges["schema"]
                    )
                ]
            )
```

---

## 5.7 Verification

### Verify with Databricks CLI

```bash
# List catalogs
databricks catalogs list

# Expected output:
# Name          Comment
# ------------  -------------------------------------
# genie_dev     Dev environment catalog for Genie
# genie_staging Staging environment catalog for Genie
# genie_prod    Prod environment catalog for Genie

# List schemas in catalog
databricks schemas list --catalog genie_dev

# Expected output:
# Name            Comment
# --------------  -------------------------------------
# curated         Clean, validated source data tables
# certified_views Pre-built SQL views for complex KPIs
# audit           Audit logs and monitoring data
# genie_eval      Genie training and evaluation data

# List tables in schema
databricks tables list --catalog genie_dev --schema curated

# Expected output:
# Name               Type
# -----------------  --------
# sales_transactions  MANAGED
# customer_master    MANAGED
# product_catalogue  MANAGED

# Describe table
databricks tables get \
  --catalog genie_dev \
  --schema curated \
  --name sales_transactions

# Check grants
databricks grants get \
  --securable-type TABLE \
  --full-name genie_dev.curated.sales_transactions
```

---

### Verify with SQL Queries

```sql
-- Connect to Databricks SQL Warehouse
-- Run these queries in Databricks SQL Editor

-- List all catalogs
SHOW CATALOGS;

-- Use dev catalog
USE CATALOG genie_dev;

-- List all schemas
SHOW SCHEMAS;

-- Use curated schema
USE SCHEMA curated;

-- List all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE sales_transactions;

-- Query table
SELECT * FROM sales_transactions LIMIT 10;

-- Check table comment
SELECT comment FROM system.information_schema.tables 
WHERE table_catalog = 'genie_dev' 
  AND table_schema = 'curated' 
  AND table_name = 'sales_transactions';

-- Check column comments
DESCRIBE EXTENDED sales_transactions;
```

---

### Verify with Python SDK

```python
from databricks.sdk import WorkspaceClient

ws = WorkspaceClient()

# List catalogs
print("Catalogs:")
for catalog in ws.catalogs.list():
    print(f"  - {catalog.name}: {catalog.comment}")

# List schemas
print("\nSchemas in genie_dev:")
for schema in ws.schemas.list(catalog_name="genie_dev"):
    print(f"  - {schema.name}: {schema.comment}")

# List tables
print("\nTables in genie_dev.curated:")
for table in ws.tables.list(catalog_name="genie_dev", schema_name="curated"):
    print(f"  - {table.name} ({table.table_type.value})")
    print(f"    Comment: {table.comment}")
    print(f"    Columns: {len(table.columns)}")

# Check grants
from databricks.sdk.service.catalog import SecurableType

grants = ws.grants.get(
    securable_type=SecurableType.TABLE,
    full_name="genie_dev.curated.sales_transactions"
)

print("\nGrants on sales_transactions:")
for grant in grants.privilege_assignments:
    print(f"  - {grant.principal}: {grant.privileges}")
```

---

## Summary

### What You've Accomplished

✅ Created Unity Catalog metastore  
✅ Attached metastore to workspace  
✅ Created 3 catalogs (dev, staging, prod)  
✅ Created 4 schemas per catalog (12 total)  
✅ Created sample tables with comments  
✅ Configured RBAC grants and permissions  
✅ Verified setup with CLI, SQL, and Python  

### Key Takeaways

1. **Metastore** is the top-level Unity Catalog container
2. **Catalogs** separate environments (dev/staging/prod)
3. **Schemas** organize data by purpose (curated, views, audit, eval)
4. **Tables** need rich comments for Genie to understand
5. **Grants** follow least-privilege principle
6. **Verification** is critical before moving to next steps

---

### Learning Checkpoint

**Q1: What's the difference between a metastore and a catalog?**
<details>
<summary>Click to reveal answer</summary>

A: Metastore is the top-level container (one per region) that stores all metadata. Catalogs are second-level namespaces within a metastore, typically separated by environment or business unit.
</details>

**Q2: Why use ISOLATED mode for catalogs?**
<details>
<summary>Click to reveal answer</summary>

A: ISOLATED mode prevents accidental cross-environment access. Only workspaces explicitly bound to the catalog can access it, ensuring dev users can't query prod data.
</details>

**Q3: What's the purpose of the genie_eval schema?**
<details>
<summary>Click to reveal answer</summary>

A: The genie_eval schema stores Genie training and evaluation data: accuracy results, benchmark queries, Q&A examples, and failure analysis. It's the "brain" of Genie learning.
</details>

**Q4: Why add comments to tables and columns?**
<details>
<summary>Click to reveal answer</summary>

A: Genie uses these comments to understand business semantics. Rich comments = better SQL generation = higher accuracy. Comments are the "dictionary" Genie reads before answering questions.
</details>

**Q5: What happens if you don't grant USE_SCHEMA privilege?**
<details>
<summary>Click to reveal answer</summary>

A: Users can't access any tables in the schema, even if they have SELECT on individual tables. USE_SCHEMA is a prerequisite for all schema-level operations.
</details>

---

### Hands-On Exercises

#### 🎯 EXERCISE 5.1: Create Complete Unity Catalog Structure

**Task:** Deploy metastore, catalogs, and schemas to all environments

**Steps:**
1. Create metastore with Pulumi
2. Attach metastore to workspace
3. Create 3 catalogs (dev, staging, prod)
4. Create 4 schemas per catalog
5. Verify with `databricks catalogs list`

**Deliverable:** Screenshot showing all 12 schemas

**Time:** 60 minutes

**Difficulty:** ⭐⭐⭐⭐☆

---

#### 🎯 EXERCISE 5.2: Create and Document Tables

**Task:** Create 7 sample tables with full documentation

**Steps:**
1. Create sales_transactions table
2. Create customer_master table
3. Create product_catalogue table
4. Create 4 more tables (inventory, financial, marketing, etc.)
5. Add table and column comments
6. Insert sample data
7. Verify with DESCRIBE commands

**Deliverable:** Output of DESCRIBE for all 7 tables

**Time:** 90 minutes

**Difficulty:** ⭐⭐⭐⭐☆

---

#### 🎯 EXERCISE 5.3: Implement RBAC Matrix

**Task:** Configure complete RBAC for all roles

**Steps:**
1. Create AAD groups (genie-admins, genie-engineers, genie-analysts)
2. Grant catalog-level permissions
3. Grant schema-level permissions
4. Grant table-level permissions
5. Test access as different roles
6. Document permission matrix

**Deliverable:** RBAC matrix document + test results

**Time:** 75 minutes

**Difficulty:** ⭐⭐⭐⭐⭐

---

**🎉 You've mastered Unity Catalog! Turn to Chapter 6 to learn CI/CD setup.**

---
