# Chapter 1: Infrastructure as Code Fundamentals

## What You'll Learn in This Chapter

By the end of this chapter, you will:
- ✅ Understand what Infrastructure as Code (IaC) is and why it matters
- ✅ Know the benefits of IaC over manual infrastructure management
- ✅ Understand Pulumi's programming model vs. declarative approaches
- ✅ Master state management concepts
- ✅ Learn IaC best practices and common anti-patterns

**Estimated Time:** 2-3 hours  
**Difficulty:** ⭐⭐☆☆☆ (Beginner)

---

## 1.1 What is Infrastructure as Code?

### Traditional Infrastructure Management

**📘 CONCEPT: The Old Way**

Before Infrastructure as Code, managing cloud infrastructure looked like this:

```
Developer needs a database
    ↓
Login to cloud portal (AWS/Azure/GCP)
    ↓
Click through UI forms
    ↓
Select instance type, storage, networking
    ↓
Click "Create"
    ↓
Wait for provisioning
    ↓
Manually configure security groups
    ↓
Manually set up backups
    ↓
Hope you remember what you did
    ↓
Repeat for staging environment (slightly different!)
    ↓
Repeat for production (hopefully different from staging...)
```

**Problems with Manual Management:**

| Problem | Impact |
|---------|--------|
| **Inconsistent environments** | Dev works, prod fails - "works on my machine" |
| **No version history** | Who changed the firewall rule? When? Why? |
| **Manual errors** | Typos, forgotten steps, misconfigurations |
| **Slow provisioning** | Hours or days to set up new environments |
| **Hard to reproduce** | Disaster recovery becomes a nightmare |
| **No code review** | Changes aren't reviewed or tested |
| **Knowledge silos** | Only one person knows how prod is configured |

---

### Infrastructure as Code Solution

**📘 CONCEPT: The New Way**

With IaC, infrastructure is defined in code files:

```python
# infrastructure/__main__.py
import pulumi_azure_native as azure_native

# Define infrastructure in code
database = azure_native.dbforpostgresql.Server(
    "genie-db",
    resource_group_name=rg.name,
    location="eastus",
    sku=azure_native.dbforpostgresql.SkuArgs(name="GP_Gen5_2"),
    storage_profile=azure_native.dbforpostgresql.StorageProfileArgs(
        storage_mb=51200,
        backup_retention_days=7
    )
)
```

```bash
# Deploy with one command
pulumi up

# That's it!
```

**Benefits of IaC:**

| Benefit | Impact |
|---------|--------|
| **Version controlled** | Every change tracked in Git with commit messages |
| **Repeatable** | Deploy identical environments every time |
| **Testable** | Run tests before deploying to production |
| **Fast** | Provision entire infrastructure in minutes |
| **Documented** | Code IS the documentation |
| **Reviewable** | Pull requests, code reviews, approvals |
| **Shareable** | Team knowledge, not individual knowledge |

---

### Real-World Example: Environment Parity

**Scenario:** Your Genie application works in dev but fails in production.

**Without IaC:**
```
Developer: "It works in dev!"
Ops: "Well, it doesn't work in prod."
Developer: "Did you configure the firewall rules?"
Ops: "I think so... let me check the portal..."
[30 minutes later]
Ops: "Oh, I forgot to add the VNet rule."
Developer: "What about the storage account CORS settings?"
Ops: "Storage account? What storage account?"
[2 hours later, still debugging]
```

**With IaC:**
```bash
# Deploy dev
pulumi up --stack dev

# Deploy staging (identical config)
pulumi up --stack staging

# Deploy prod (same code, larger instance sizes)
pulumi up --stack prod

# All three environments are identical!
# If it works in dev, it works in prod.
```

---

## 1.2 IaC Tools Comparison

### Evolution of IaC Tools

```
2010-2015: CloudFormation, Heat, ARM Templates
    ↓ (vendor-specific, YAML/JSON hell)
    
2015-2018: Terraform emerges
    ↓ (multi-cloud, HCL declarative language)
    
2018-2020: Pulumi launches
    ↓ (use real programming languages)
    
2020-Present: CDK, Wing, other programming-language IaC
    ↓ (developer-first approach)
```

### Terraform vs. Pulumi

**📘 CONCEPT: Declarative vs. Imperative**

**Terraform (Declarative - HCL):**
```hcl
# You declare WHAT you want
resource "azurerm_resource_group" "rg" {
  name     = "genie-rg"
  location = "eastus"
  
  tags = {
    Environment = "dev"
  }
}

# Loops require special syntax
resource "azurerm_storage_account" "storage" {
  count                = 3
  name                 = "geniestorage${count.index}"
  location             = azurerm_resource_group.rg.location
  resource_group_name  = azurerm_resource_group.rg.name
  account_tier         = "Standard"
  account_replication_type = "LRS"
}

# Conditionals require ternary operator
sku = var.environment == "prod" ? "Premium" : "Standard"
```

**Pulumi (Imperative - Python):**
```python
# You program HOW to create it
import pulumi_azure_native as azure_native

rg = azure_native.resources.ResourceGroup(
    "genie-rg",
    resource_group_name="genie-rg",
    location="eastus",
    tags={"Environment": "dev"}
)

# Loops are just Python loops
for i in range(3):
    storage = azure_native.storage.StorageAccount(
        f"geniestorage{i}",
        resource_group_name=rg.name,
        location=rg.location,
        sku=azure_native.storage.SkuArgs(name="Standard_LRS")
    )

# Conditionals are just Python if statements
sku = "Premium" if env == "prod" else "Standard"
```

---

### Detailed Comparison Table

| Feature | Terraform | Pulumi | Winner |
|---------|-----------|--------|--------|
| **Language** | HCL (custom DSL) | Python, TypeScript, Go, C# | 🏆 Pulumi (use skills you have) |
| **Learning Curve** | Learn HCL syntax | Use existing programming knowledge | 🏆 Pulumi |
| **Loops & Conditionals** | Special HCL syntax (`count`, `for_each`) | Native language constructs | 🏆 Pulumi |
| **Testing** | Limited (terratest, external tools) | Full testing frameworks (pytest, jest) | 🏆 Pulumi |
| **State Management** | .tfstate files (manual backup) | Managed cloud state (auto-backup) | 🏆 Pulumi |
| **Rollback** | Manual (terraform state mv) | One-click in Pulumi Console | 🏆 Pulumi |
| **Multi-cloud** | ✅ Excellent | ✅ Excellent | 🤝 Tie |
| **Community** | Larger, more providers | Growing fast, good coverage | 🏆 Terraform (but narrowing) |
| **Cost** | Free (open source) | Free tier + paid team features | 🏆 Terraform (for teams) |
| **Code Reuse** | Modules (limited) | Packages, classes, functions | 🏆 Pulumi |

---

### Why We Chose Pulumi for This Book

**Reason 1: Python is Universal**
```python
# Same language for:
# - Infrastructure (Pulumi)
# - Data pipelines (PySpark)
# - Testing (pytest)
# - Automation scripts

# No context switching between HCL and Python!
```

**Reason 2: Better Abstractions**
```python
# Create reusable components
class GenieEnvironment(pulumi.ComponentResource):
    def __init__(self, name, env_config):
        super().__init__("genie:Environment", name)
        
        self.catalog = databricks.Catalog(...)
        self.warehouse = databricks.SqlWarehouse(...)
        self.schemas = self._create_schemas()
        
# Use it like any Python class
dev_env = GenieEnvironment("dev-env", {"env": "dev"})
staging_env = GenieEnvironment("staging-env", {"env": "staging"})
```

**Reason 3: Testing**
```python
import pytest

def test_resource_group_created():
    stack = pulumi.StackReference("dev")
    rg_name = stack.get_output("resource_group_name")
    assert rg_name is not None
    assert "genie" in rg_name
```

**Reason 4: Error Handling**
```python
try:
    workspace = azure_native.databricks.Workspace(...)
except Exception as e:
    print(f"Failed to create workspace: {e}")
    # Retry logic, fallback, or graceful failure
```

---

## 1.3 Pulumi Core Concepts

### Resources

**📘 CONCEPT: What is a Resource?**

A resource is a cloud infrastructure component that Pulumi manages.

**Anatomy of a Resource:**
```python
workspace = azure_native.databricks.Workspace(
    "logical-name",           # Name in Pulumi code (for tracking)
    workspace_name="actual-name",  # Name in Azure (must be unique)
    location="eastus",        # Property: Azure region
    sku=azure_native.databricks.SkuArgs(name="premium"),  # Property: SKU tier
    tags={"Environment": "dev"}  # Property: Resource tags
)
```

**Resource Properties:**
- **Input Properties:** Values you provide (location, sku, tags)
- **Output Properties:** Values returned by Azure (workspace_url, workspace_id)
- **Computed Properties:** Values derived from other properties

**Resource Types:**
```python
# Compute
azure_native.compute.VirtualMachine
azure_native.containerService.ManagedCluster  # AKS

# Storage
azure_native.storage.StorageAccount
azure_native.storage.BlobContainer

# Database
azure_native.sql.Server
azure_native.dbforpostgresql.Server

# Databricks
azure_native.databricks.Workspace
databricks.Catalog
databricks.Schema
databricks.SqlWarehouse
```

---

### Providers

**📘 CONCEPT: What is a Provider?**

A provider is a plugin that Pulumi uses to interact with a specific cloud or service.

**Built-in Providers:**
```python
# Azure Native (modern, full-featured)
import pulumi_azure_native as azure_native

# Azure Classic (legacy, some features only here)
import pulumi_azure as azure

# Databricks
import pulumi_databricks as databricks

# AWS
import pulumi_aws as aws

# GCP
import pulumi_gcp as gcp
```

**Provider Configuration:**
```python
import pulumi_databricks as databricks

# Configure Databricks provider
databricks_provider = databricks.Provider(
    "databricks-provider",
    host="https://adb-123456789.azuredatabricks.net",
    token=databricks_token  # from config or environment
)

# Use provider for resources
warehouse = databricks.SqlWarehouse(
    "genie-warehouse",
    name="Genie Analytics",
    cluster_size="Small",
    opts=pulumi.ResourceOptions(provider=databricks_provider)
)
```

**Multi-Provider Scenarios:**
```python
# Deploy to multiple Azure subscriptions
provider_sub1 = azure_native.Provider("sub1", subscription_id="sub-id-1")
provider_sub2 = azure_native.Provider("sub2", subscription_id="sub-id-2")

# Deploy to multiple clouds
azure_provider = azure_native.Provider("azure")
aws_provider = aws.Provider("aws")

# Cross-cloud architectures
azure_vnet = azure_native.network.VirtualNetwork(..., opts=provider(azure_provider))
aws_vpc = aws.ec2.Vpc(..., opts=provider(aws_provider))
```

---

### Stacks

**📘 CONCEPT: What is a Stack?**

A stack is an isolated deployment environment. Think of it as a "named instance" of your infrastructure.

**Stack Isolation:**
```
genie-platform/
├── Pulumi.yaml          # Same project for all
├── Pulumi.dev.yaml      # Dev config
├── Pulumi.staging.yaml  # Staging config
├── Pulumi.prod.yaml     # Prod config
└── __main__.py          # Same code for all
```

**Stack Operations:**
```bash
# List all stacks
pulumi stack ls

# Output:
# NAME        LAST UPDATE    RESOURCE COUNT
# dev*        2 hours ago    15
# prod        1 day ago      15
# staging     3 days ago     15

# Select active stack
pulumi stack select dev

# Create new stack
pulumi stack init test

# Delete stack
pulumi stack rm test

# Import/export stack config
pulumi stack export > dev-state.json
pulumi stack import < dev-state.json
```

**Stack Configuration:**
```bash
# Set config values
pulumi config set environment dev
pulumi config set location eastus

# Set secrets (encrypted)
pulumi config set --secret databricks_token

# View config
pulumi config

# Output:
# KEY                 VALUE
# environment         dev
# location            eastus
# databricks_token    [secret]
```

**Using Config in Code:**
```python
import pulumi

config = pulumi.Config()

# Get values
env = config.get("environment") or "dev"  # Default to "dev"
location = config.get("location") or "eastus"

# Get secrets (automatically decrypted)
db_token = config.require_secret("databricks_token")

# Get typed values
max_clusters = config.get_int("max_clusters") or 1
enable_monitoring = config.get_bool("monitoring") or False
```

---

### State

**📘 CONCEPT: What is State?**

State is Pulumi's record of what infrastructure exists. It maps your code to real cloud resources.

**Why State Matters:**

Without state, Pulumi wouldn't know:
- What resources were created
- What their IDs are in the cloud
- What properties they have
- What changes need to be made

**State Contents:**
```json
{
  "version": 3,
  "deployment": {
    "resources": [
      {
        "type": "azure-native:resources/resourceGroup:ResourceGroup",
        "urn": "urn:pulumi:dev::genie-platform::azure-native:resources/resourceGroup:ResourceGroup::genie-rg",
        "id": "/subscriptions/xxx/resourceGroups/genie-rg",
        "inputs": {
          "location": "eastus",
          "resourceGroupName": "genie-rg"
        },
        "outputs": {
          "id": "/subscriptions/xxx/resourceGroups/genie-rg",
          "name": "genie-rg"
        }
      }
    ]
  }
}
```

**State Backends Comparison:**

| Backend | Pros | Cons | Best For |
|---------|------|------|----------|
| **Pulumi Cloud** | Free, managed, web UI, rollbacks, team features | Requires internet | Most teams (recommended) |
| **Local File** | Offline, full control | No backups, no team features | Learning, testing |
| **Azure Blob** | Self-managed, team access | Setup complexity, cost | Enterprise, compliance |
| **AWS S3** | Self-managed, team access | Setup complexity | AWS-heavy shops |
| **GCP GCS** | Self-managed, team access | Setup complexity | GCP-heavy shops |

**State Operations:**
```bash
# View state
pulumi stack

# Refresh state from cloud (detect drift)
pulumi refresh

# Preview changes
pulumi preview

# Export state
pulumi stack export > state.json

# Import state
pulumi stack import < state.json

# Delete a resource from state (dangerous!)
pulumi state delete 'urn:pulumi:dev::...'

# Move resource to different stack
pulumi state move 'urn:pulumi:dev::...' --to-stack prod
```

---

### Outputs

**📘 CONCEPT: What are Outputs?**

Outputs are values exported from a stack for use by other stacks, scripts, or team members.

**Defining Outputs:**
```python
import pulumi

# Simple output
pulumi.export("workspace_url", workspace.workspace_url)

# Computed output
pulumi.export("workspace_id", workspace.workspace_id)

# Complex output
pulumi.export("connection_info", {
    "host": workspace.workspace_url,
    "catalog": catalog.name,
    "warehouse_id": warehouse.id
})

# Output from multiple resources
pulumi.export("storage_url", 
    pulumi.Output.all(storage_account.name, container.name).apply(
        lambda args: f"https://{args[0]}.dfs.core.windows.net/{args[1]}"
    )
)
```

**Using Outputs:**
```bash
# View all outputs
pulumi stack output

# Get specific output
pulumi stack output workspace_url

# Use in shell scripts
WORKSPACE_URL=$(pulumi stack output workspace_url)
echo "Connect to: https://$WORKSPACE_URL"

# Use in other stacks
dev_stack = pulumi.StackReference("dev")
dev_workspace_url = dev_stack.get_output("workspace_url")
```

**Output Best Practices:**
```python
# ✅ DO: Export useful connection info
pulumi.export("workspace_url", workspace.workspace_url)
pulumi.export("catalog_name", catalog.name)

# ✅ DO: Mark secrets as secret
pulumi.export("connection_string", pulumi.Output.secret(conn_string))

# ❌ DON'T: Export sensitive data
pulumi.export("admin_password", admin_password)  # BAD!

# ❌ DON'T: Export everything
# Only export what's needed
```

---

## 1.4 Resource Dependencies

### Implicit Dependencies

**📘 CONCEPT: Automatic Dependency Tracking**

Pulumi automatically tracks dependencies based on resource references.

```python
# Resource group created first
rg = azure_native.resources.ResourceGroup("rg", ...)

# Workspace depends on RG (because rg.name is used)
workspace = azure_native.databricks.Workspace("ws",
    resource_group_name=rg.name  # ← Creates implicit dependency
)

# Storage depends on workspace
storage_key = azure_native.storage.list_storage_account_keys(
    resource_group_name=rg.name,
    account_name=storage.name
)
```

**Dependency Graph:**
```
Resource Group
     ↓
Storage Account
     ↓
Databricks Workspace
     ↓
Unity Catalog
     ↓
Schemas
     ↓
Tables
```

---

### Explicit Dependencies

**When to Use:**
Sometimes you need to enforce ordering even without direct references.

```python
# Wait for workspace to be fully ready before creating warehouse
warehouse = databricks.SqlWarehouse("warehouse",
    name="Genie Warehouse",
    cluster_size="Small",
    opts=pulumi.ResourceOptions(
        depends_on=[workspace]  # ← Explicit dependency
    )
)

# Multiple dependencies
schema = databricks.Schema("schema",
    catalog_name=catalog.name,
    opts=pulumi.ResourceOptions(
        depends_on=[catalog, metastore_assignment]
    )
)
```

---

### Protecting Resources

**Prevent Accidental Deletion:**
```python
# Mark resource as protected
catalog = databricks.Catalog("catalog",
    name="genie_prod",
    opts=pulumi.ResourceOptions(
        protect=True  # ← Cannot be deleted without removing protect first
    )
)

# To delete later:
# 1. Remove protect=True
# 2. Run pulumi up
# 3. Run pulumi destroy
```

---

## 1.5 Component Resources

**📘 CONCEPT: Custom Abstractions**

Component resources let you package multiple resources into a reusable unit.

**Basic Component:**
```python
class GenieCatalog(pulumi.ComponentResource):
    """
    Reusable component: Unity Catalog with standard schemas
    """
    
    def __init__(self, name, catalog_name, opts=None):
        # Call parent constructor
        super().__init__("genie:Catalog", name, {}, opts)
        
        # Create catalog
        self.catalog = databricks.Catalog(
            f"{name}-catalog",
            name=catalog_name,
            comment=f"{catalog_name} catalog",
            isolation_mode="ISOLATED",
            opts=pulumi.ResourceOptions(parent=self)
        )
        
        # Create standard schemas
        self.schemas = {}
        for schema_name in ["curated", "certified_views", "audit", "genie_eval"]:
            self.schemas[schema_name] = databricks.Schema(
                f"{name}-{schema_name}-schema",
                catalog_name=self.catalog.name,
                name=schema_name,
                opts=pulumi.ResourceOptions(parent=self)
            )
        
        # Register outputs
        self.register_outputs({
            "catalog_name": self.catalog.name,
            "schema_names": list(self.schemas.keys())
        })

# Use the component
dev_catalog = GenieCatalog("dev", "genie_dev")
staging_catalog = GenieCatalog("staging", "genie_staging")
prod_catalog = GenieCatalog("prod", "genie_prod")
```

**Advanced Component with Configuration:**
```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class GenieEnvironmentConfig:
    environment: str
    location: str
    workspace_sku: str
    warehouse_size: str
    enable_monitoring: bool = True

class GenieEnvironment(pulumi.ComponentResource):
    """
    Complete Genie environment: Workspace + Catalog + Schemas + Warehouse
    """
    
    def __init__(self, name: str, config: GenieEnvironmentConfig, opts=None):
        super().__init__("genie:Environment", name, {}, opts)
        
        # Resource group
        self.rg = azure_native.resources.ResourceGroup(
            f"{name}-rg",
            resource_group_name=f"genie-{config.environment}-rg",
            location=config.location,
            opts=pulumi.ResourceOptions(parent=self)
        )
        
        # Storage account
        self.storage = azure_native.storage.StorageAccount(
            f"{name}-storage",
            resource_group_name=self.rg.name,
            location=self.rg.location,
            sku=azure_native.storage.SkuArgs(name="Standard_GRS"),
            opts=pulumi.ResourceOptions(parent=self)
        )
        
        # Databricks workspace
        self.workspace = azure_native.databricks.Workspace(
            f"{name}-workspace",
            resource_group_name=self.rg.name,
            location=self.rg.location,
            sku=azure_native.databricks.SkuArgs(name=config.workspace_sku),
            opts=pulumi.ResourceOptions(parent=self)
        )
        
        # SQL warehouse
        self.warehouse = databricks.SqlWarehouse(
            f"{name}-warehouse",
            name=f"Genie {config.environment.title()} Warehouse",
            cluster_size=config.warehouse_size,
            auto_stop_mins=30 if config.environment != "prod" else 0,
            opts=pulumi.ResourceOptions(
                parent=self,
                depends_on=[self.workspace]
            )
        )
        
        # Register outputs
        self.register_outputs({
            "workspace_url": self.workspace.workspace_url,
            "warehouse_id": self.warehouse.id,
            "storage_account": self.storage.name
        })
```

---

## 1.6 Best Practices

### Do's ✅

**1. Use Separate Stacks Per Environment**
```bash
# ✅ GOOD
pulumi stack init dev
pulumi stack init staging
pulumi stack init prod

# ❌ BAD
# Using one stack for everything
# Using if-statements to switch environments in code
```

**2. Tag All Resources**
```python
common_tags = {
    "Environment": env.upper(),
    "Project": "Genie",
    "ManagedBy": "Pulumi",
    "CostCenter": "Data-Platform",
    "Owner": "data-team@company.com"
}

resource_group = azure_native.resources.ResourceGroup(
    "rg",
    tags=common_tags
)
```

**3. Use Secrets for Sensitive Data**
```python
# ✅ GOOD
config = pulumi.Config()
db_token = config.require_secret("databricks_token")

# Store as secret
pulumi.export("connection_string", pulumi.Output.secret(conn_string))

# ❌ BAD
db_token = "dapi1234567890"  # Hardcoded!
pulumi.export("password", admin_password)  # Not marked as secret
```

**4. Add Descriptions and Comments**
```python
# ✅ GOOD
workspace = azure_native.databricks.Workspace(
    "genie-workspace",
    # Premium SKU required for Unity Catalog and Genie
    # Standard tier lacks metastore support
    sku=azure_native.databricks.SkuArgs(name="premium"),
    workspace_name=f"genie-{env}-workspace",
    # Enable private networking for production
    parameters=azure_native.databricks.WorkspacePropertiesParametersArgs(
        enable_no_public_ip=(env == "prod")
    )
)

# ❌ BAD
ws = azure_native.databricks.Workspace("ws", sku=azure_native.databricks.SkuArgs(name="premium"))
```

**5. Use Type Hints and Docstrings**
```python
# ✅ GOOD
from typing import List, Dict, Optional

def create_schemas(catalog_name: str, schema_names: List[str]) -> List[databricks.Schema]:
    """
    Create standard schemas in a Unity Catalog.
    
    Args:
        catalog_name: Name of the Unity Catalog
        schema_names: List of schema names to create
    
    Returns:
        List of created Schema resources
    """
    schemas = []
    for name in schema_names:
        schema = databricks.Schema(...)
        schemas.append(schema)
    return schemas

# ❌ BAD
def create_schemas(cat, names):
    schemas = []
    for n in names:
        s = databricks.Schema(...)
        schemas.append(s)
    return schemas
```

---

### Don'ts ❌

**1. Don't Hardcode Credentials**
```python
# ❌ NEVER DO THIS
databricks_provider = databricks.Provider(
    "provider",
    host="https://workspace.azuredatabricks.net",
    token="dapi1234567890"  # EXPOSED IN CODE!
)

# ✅ DO THIS
config = pulumi.Config()
db_token = config.require_secret("databricks_token")

databricks_provider = databricks.Provider(
    "provider",
    host=config.get("databricks_host"),
    token=db_token
)
```

**2. Don't Share Stacks Between Environments**
```python
# ❌ BAD
if env == "prod":
    sku = "premium"
else:
    sku = "standard"

# ✅ GOOD
# Use separate stacks with different config files
# Pulumi.dev.yaml: workspace_sku: standard
# Pulumi.prod.yaml: workspace_sku: premium
```

**3. Don't Skip Preview**
```bash
# ❌ BAD
pulumi up --yes  # No review!

# ✅ GOOD
pulumi preview  # Review changes first
pulumi up       # Then deploy
```

**4. Don't Ignore Drift Warnings**
```bash
# ❌ BAD
# Pulumi warns: "Resource was modified outside of Pulumi"
# You: Ignores warning

# ✅ GOOD
# Pulumi warns: "Resource was modified outside of Pulumi"
# You: Run `pulumi refresh` to sync state
# Then investigate who made the change
```

**5. Don't Use Default Names**
```python
# ❌ BAD
rg = azure_native.resources.ResourceGroup("rg", ...)
# Creates: "rg-12345678"

# ✅ GOOD
rg = azure_native.resources.ResourceGroup(
    "genie-rg",
    resource_group_name="genie-production-rg",
    ...
)
```

---

## 1.7 Common Anti-Patterns

### Anti-Pattern 1: Magic Strings

```python
# ❌ BAD
workspace = azure_native.databricks.Workspace(
    "workspace",
    sku=azure_native.databricks.SkuArgs(name="premium"),
    location="eastus"
)

# ✅ GOOD
SKU_PREMIUM = "premium"
LOCATION_DEFAULT = "eastus"

workspace = azure_native.databricks.Workspace(
    "workspace",
    sku=azure_native.databricks.SkuArgs(name=SKU_PREMIUM),
    location=LOCATION_DEFAULT
)
```

---

### Anti-Pattern 2: Monolithic Files

```python
# ❌ BAD: Everything in one file (500+ lines)
# __main__.py contains:
# - Resource groups
# - Storage accounts
# - Databricks workspace
# - Unity Catalog
# - Schemas
# - Tables
# - Genie Spaces
# - Tests

# ✅ GOOD: Modular structure
# infrastructure/
# ├── __main__.py              # Entry point, orchestrates modules
# ├── resource_groups.py       # Resource group creation
# ├── storage.py               # Storage accounts
# ├── databricks_workspace.py  # Workspace setup
# ├── unity_catalog.py         # Catalog and schemas
# └── genie_spaces.py          # Genie configuration
```

---

### Anti-Pattern 3: No Error Handling

```python
# ❌ BAD
workspace = azure_native.databricks.Workspace(...)
catalog = databricks.Catalog(...)

# What if workspace creation fails?
# What if catalog already exists?

# ✅ GOOD
import logging
from typing import Optional

log = logging.getLogger(__name__)

def create_workspace_safely(env: str) -> Optional[databricks.Workspace]:
    try:
        workspace = azure_native.databricks.Workspace(
            f"genie-ws-{env}",
            workspace_name=f"genie-{env}-workspace",
            sku=azure_native.databricks.SkuArgs(name="premium")
        )
        log.info(f"Created workspace for {env}")
        return workspace
    except Exception as e:
        log.error(f"Failed to create workspace: {e}")
        raise
```

---

### Anti-Pattern 4: Ignoring Resource Limits

```python
# ❌ BAD
# Creating 100 storage accounts in a loop
for i in range(100):
    storage = azure_native.storage.StorageAccount(f"storage{i}", ...)

# Azure has subscription limits!
# Result: Deployment fails at storage account #47

# ✅ GOOD
# Check limits first
# Use resource naming that allows growth
# Implement retry logic

MAX_STORAGE_ACCOUNTS = 50  # Per subscription limit

if len(environments) > MAX_STORAGE_ACCOUNTS:
    raise ValueError(f"Too many environments: {len(environments)} > {MAX_STORAGE_ACCOUNTS}")
```

---

### Anti-Pattern 5: No Testing

```python
# ❌ BAD
# Code written, deployed once, never tested

# ✅ GOOD
import pytest

def test_resource_group_created():
    stack = pulumi.StackReference("dev")
    rg_name = stack.get_output("resource_group_name")
    assert rg_name is not None
    assert "genie" in rg_name

def test_workspace_url_valid():
    stack = pulumi.StackReference("dev")
    url = stack.get_output("workspace_url")
    assert url is not None
    assert "azuredatabricks.net" in url

def test_catalogs_exist():
    from databricks.sdk import WorkspaceClient
    ws = WorkspaceClient()
    catalogs = [c.name for c in ws.catalogs.list()]
    assert "genie_dev" in catalogs
    assert "genie_staging" in catalogs
    assert "genie_prod" in catalogs
```

---

## Summary

### Key Takeaways

1. **IaC Benefits:** Version control, repeatability, testing, documentation
2. **Pulumi Advantages:** Use Python, better abstractions, native testing
3. **Core Concepts:** Resources, Providers, Stacks, State, Outputs
4. **Dependencies:** Implicit (automatic) and explicit (depends_on)
5. **Components:** Reusable abstractions for complex infrastructure
6. **Best Practices:** Separate stacks, tag resources, use secrets, add comments
7. **Anti-Patterns:** Magic strings, monolithic files, no testing

---

### Learning Checkpoint

**Q1: What's the difference between a resource and a component resource?**
<details>
<summary>Click to reveal answer</summary>

A: A resource maps to a single cloud resource (e.g., Storage Account). A component resource is a custom abstraction that packages multiple resources together (e.g., complete environment with workspace + catalog + schemas).
</details>

**Q2: Why use separate stacks for environments instead of if-statements in code?**
<details>
<summary>Click to reveal answer</summary>

A: Separate stacks provide isolation, independent state, easier rollbacks, and clearer separation of concerns. If-statements create complexity and risk of deploying dev config to prod.
</details>

**Q3: What happens if you skip `pulumi preview`?**
<details>
<summary>Click to reveal answer</summary>

A: You might deploy unintended changes, delete resources accidentally, or miss configuration errors. Preview is your safety net.
</details>

**Q4: How does Pulumi track dependencies between resources?**
<details>
<summary>Click to reveal answer</summary>

A: Implicitly through property references (using `rg.name` creates dependency on `rg`). Explicitly through `depends_on` in ResourceOptions.
</details>

**Q5: Why mark outputs as secrets?**
<details>
<summary>Click to reveal answer</summary>

A: Secrets are encrypted in state and logs. Regular outputs are visible to anyone with stack access. Connection strings, passwords, and tokens should always be secrets.
</details>

---

### Hands-On Exercises

#### 🎯 EXERCISE 1.1: Compare Terraform and Pulumi

**Task:** Write the same infrastructure in both HCL and Python

**Steps:**
1. Create a simple Terraform config (resource group + storage account)
2. Write equivalent Pulumi code
3. Compare line counts, readability, complexity
4. Deploy both and verify they create identical resources

**Deliverable:** Side-by-side code comparison with notes

**Time:** 45 minutes

**Difficulty:** ⭐⭐⭐☆☆

---

#### 🎯 EXERCISE 1.2: Create a Component Resource

**Task:** Package a common pattern into a reusable component

**Steps:**
1. Identify a pattern you'll use multiple times (e.g., catalog + 4 schemas)
2. Create a Python class inheriting from `pulumi.ComponentResource`
3. Instantiate it 3 times (dev, staging, prod)
4. Deploy and verify all instances

**Deliverable:** Working component with 3 instances deployed

**Time:** 60 minutes

**Difficulty:** ⭐⭐⭐⭐☆

---

#### 🎯 EXERCISE 1.3: Implement Drift Detection

**Task:** Manually modify a resource and detect it with Pulumi

**Steps:**
1. Deploy a resource group with Pulumi
2. Manually add a tag in Azure Portal
3. Run `pulumi preview` and observe drift warning
4. Run `pulumi refresh` to sync state
5. Decide: keep manual change or revert?

**Deliverable:** Screenshot of drift detection and explanation of resolution

**Time:** 30 minutes

**Difficulty:** ⭐⭐☆☆☆

---

**🎉 You've mastered IaC fundamentals! Turn to Chapter 2 to learn Pulumi Python patterns.**

---
