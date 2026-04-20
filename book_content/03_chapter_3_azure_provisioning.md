# Chapter 3: Azure Resource Provisioning

## What You'll Learn in This Chapter

By the end of this chapter, you will:
- ✅ Understand Azure resource group design patterns
- ✅ Create storage accounts for Unity Catalog metastore
- ✅ Provision Databricks workspaces with correct SKU
- ✅ Configure networking and security settings
- ✅ Deploy complete infrastructure with Pulumi
- ✅ Verify deployments and troubleshoot issues

**Estimated Time:** 4-5 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Intermediate)

---

## 3.1 Architecture Overview

### Complete Infrastructure Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     AZURE SUBSCRIPTION                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Resource Group: genie-dev-rg             │    │
│  │                                                     │    │
│  │  ┌──────────────────┐    ┌──────────────────┐     │    │
│  │  │  Storage Account │    │  Databricks      │     │    │
│  │  │  geniestorage    │───▶│  Workspace       │     │    │
│  │  │                  │    │  genie-dev-ws    │     │    │
│  │  │  Containers:     │    │                  │     │    │
│  │  │  - unity-catalog │    │  SKU: Premium    │     │    │
│  │  │                  │    │                  │     │    │
│  │  └──────────────────┘    └──────────────────┘     │    │
│  │                            │                       │    │
│  │                            │ Managed Resource      │    │
│  │                            ▼ Group                │    │
│  │                     ┌──────────────────┐          │    │
│  │                     │  Databricks      │          │    │
│  │                     │  Managed VNet    │          │    │
│  │                     │  (auto-created)  │          │    │
│  │                     └──────────────────┘          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Resource Group: genie-staging-rg           │    │
│  │         (Same structure as dev)                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Resource Group: genie-prod-rg             │    │
│  │          (Same structure as dev)                   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Resource Dependencies

```
1. Resource Group (foundation)
   ↓
2. Storage Account (for metastore)
   ↓
3. Databricks Workspace (needs RG + Storage)
   ↓
4. Unity Catalog Metastore (needs Workspace)
   ↓
5. Catalogs & Schemas (need Metastore)
```

### Naming Conventions

| Resource Type | Pattern | Example |
|--------------|---------|---------|
| Resource Group | `genie-{env}-rg` | `genie-dev-rg` |
| Storage Account | `geniestg{env}{unique}` | `geniestgdev123` |
| Workspace | `genie-{env}-ws` | `genie-dev-ws` |
| Container | `unity-catalog` | `unity-catalog` |
| Metastore | `genie-{env}-metastore` | `genie-dev-metastore` |

**⚠️ STORAGE ACCOUNT NAMING RULES:**
- Must be globally unique across ALL of Azure
- 3-24 characters, lowercase letters and numbers only
- No hyphens or underscores
- Solution: Add random suffix or use environment abbreviation

---

## 3.2 Resource Group

### 📘 CONCEPT: What is a Resource Group?

A resource group is a logical container in Azure that holds related resources.

**Key Characteristics:**
- Resources in the same lifecycle should be in the same RG
- RBAC permissions can be applied at RG level
- Billing can be tracked by RG
- Resources can't span multiple RGs
- Deleting an RG deletes all resources inside it

**Best Practices:**
- One RG per environment (dev, staging, prod)
- Consistent naming across environments
- Tag all resources for cost tracking
- Don't mix unrelated resources

---

### Basic Resource Group Code

```python
# infrastructure/__main__.py
import pulumi
import pulumi_azure_native as azure_native

# Configuration
config = pulumi.Config()
env = config.get("environment") or "dev"
location = config.get("location") or "eastus"

# Common tags for all resources
common_tags = {
    "Environment": env.upper(),
    "Project": "Genie",
    "ManagedBy": "Pulumi",
    "CostCenter": "Data-Platform"
}

# Create resource group
resource_group = azure_native.resources.ResourceGroup(
    "genie-rg",  # Logical name in Pulumi
    resource_group_name=f"genie-{env}-rg",  # Actual name in Azure
    location=location,
    tags=common_tags
)

# Export the name
pulumi.export("resource_group_name", resource_group.name)
```

### Deploy and Verify

```bash
# Preview
pulumi preview

# Expected output:
# Previewing update (dev):
#  + azure-native:resources:ResourceGroup genie-rg create
#
# Resources:
#   + 1 to create

# Deploy
pulumi up

# Expected output:
# Updating (dev):
#  + azure-native:resources:ResourceGroup genie-rg created (2.3s)
#
# Outputs:
#   resource_group_name: "genie-dev-rg"

# Verify in Azure CLI
az group show --name genie-dev-rg --output table

# Expected:
# Location    Name           ProvisioningState
# ----------  -------------  -------------------
# eastus      genie-dev-rg   Succeeded
```

---

### Advanced: Resource Group with Lock

```python
# Prevent accidental deletion in production
if env == "prod":
    lock = azure_native.authorization.Lock(
        "prod-rg-lock",
        resource_group_name=resource_group.name,
        lock_name="CannotDeleteResourceLock",
        level="CanNotDelete",  # or "ReadOnly"
        notes="Production RG - requires lock removal before deletion"
    )
```

---

## 3.3 Storage Account for Unity Catalog

### 📘 CONCEPT: Why Storage Account?

Unity Catalog needs cloud storage to manage:
- Managed tables (data files)
- Delta transaction logs
- Table metadata
- Query cache

**Storage Account Types:**
- **Standard LRS:** Local redundancy (cheapest, least durable)
- **Standard GRS:** Geo-redundant (recommended for prod)
- **Premium LRS:** SSD-backed (for high-performance workloads)

**For Genie:**
- Dev/Staging: Standard LRS is fine
- Production: Standard GRS or ZRS

---

### Storage Account Code

```python
# Create storage account
storage_account = azure_native.storage.StorageAccount(
    "geniestorage",  # Logical name
    resource_group_name=resource_group.name,
    location=resource_group.location,
    sku=azure_native.storage.SkuArgs(
        name="Standard_GRS"  # Geo-redundant storage
    ),
    kind="StorageV2",  # General purpose v2
    enable_https_traffic_only=True,  # Security best practice
    minimum_tls_version="TLS1_2",  # Enforce TLS 1.2
    allow_blob_public_access=False,  # No public access
    tags=common_tags
)

# Create container for Unity Catalog metastore
container = azure_native.storage.BlobContainer(
    "unitycatalogcontainer",
    resource_group_name=resource_group.name,
    account_name=storage_account.name,
    public_access=azure_native.storage.PublicAccess.NONE,  # Private
    metadata={
        "purpose": "unity-catalog-metastore",
        "environment": env
    }
)

# Get storage account key (needed for Databricks)
storage_keys = azure_native.storage.list_storage_account_keys(
    resource_group_name=resource_group.name,
    account_name=storage_account.name
)

# Export storage details
pulumi.export("storage_account_name", storage_account.name)
pulumi.export("container_name", container.name)
pulumi.export("storage_account_key", 
    pulumi.Output.secret(storage_keys.keys[0].value)  # Mark as secret!
)
```

### Storage Account URL Format

```python
# Blob storage URL
blob_url = storage_account.id.apply(
    lambda id: f"https://{storage_account.name}.blob.core.windows.net/{container.name}"
)

# DFS (Data Lake) URL - preferred for Unity Catalog
dfs_url = storage_account.id.apply(
    lambda id: f"abfss://{container.name}@{storage_account.name}.dfs.core.windows.net/"
)

pulumi.export("metastore_url", dfs_url)
```

---

### 💡 Security Hardening

```python
# Production storage account with enhanced security
storage_account = azure_native.storage.StorageAccount(
    "geniestorage",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    sku=azure_native.storage.SkuArgs(name="Standard_GRS"),
    kind="StorageV2",
    enable_https_traffic_only=True,
    minimum_tls_version="TLS1_2",
    allow_blob_public_access=False,
    
    # Enable soft delete (recover from accidental deletion)
    blob_restore_policy=azure_native.storage.BlobRestorePolicyArgs(
        days=7  # Retain deleted blobs for 7 days
    ),
    
    # Enable encryption
    encryption=azure_native.storage.EncryptionArgs(
        key_source="Microsoft.Storage",
        services=azure_native.storage.EncryptionServicesArgs(
            blob=azure_native.storage.EncryptionServiceArgs(
                enabled=True,
                key_type="Account"
            ),
            file=azure_native.storage.EncryptionServiceArgs(
                enabled=True,
                key_type="Account"
            )
        )
    ),
    
    # Network rules (restrict access)
    network_rule_set=azure_native.storage.NetworkRuleSetArgs(
        default_action="Deny",  # Deny all by default
        bypass="AzureServices",  # Allow Azure services
        virtual_network_rules=[],  # Add specific VNets if needed
        ip_rules=[]  # Add specific IPs if needed
    ),
    
    tags=common_tags
)
```

---

## 3.4 Databricks Workspace

### 📘 CONCEPT: Databricks Workspace Tiers

| Feature | Standard | Premium | Enterprise |
|---------|----------|---------|------------|
| **Unity Catalog** | ❌ | ✅ | ✅ |
| **Databricks Genie** | ❌ | ✅ | ✅ |
| **Row/Column Security** | ❌ | ✅ | ✅ |
| **Audit Logs** | ❌ | ✅ | ✅ |
| **SCIM Provisioning** | ❌ | ✅ | ✅ |
| **Advanced Security** | ❌ | ❌ | ✅ |

**For Genie: Premium tier is MINIMUM required**

---

### Basic Workspace Code

```python
# Create Databricks workspace
workspace = azure_native.databricks.Workspace(
    "genie-workspace",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    workspace_name=f"genie-{env}-workspace",
    sku=azure_native.databricks.SkuArgs(name="premium"),  # Required for Genie!
    managed_resource_group_id=resource_group.id,
    
    # Enable Unity Catalog by default
    default_catalog=azure_native.databricks.DefaultCatalogArgs(
        initial_name="genie_catalog",
        initial_type=azure_native.databricks.InitialType.UNITY_CATALOG
    ),
    
    tags=common_tags
)

# Export workspace details
pulumi.export("workspace_url", workspace.workspace_url)
pulumi.export("workspace_id", workspace.workspace_id)
pulumi.export("workspace_name", workspace.name)
```

---

### 💡 Workspace Naming Gotcha

**⚠️ WARNING:** Databricks workspace names must be **globally unique** within the Azure region!

```python
# ❌ BAD: Might fail if name already exists
workspace_name=f"genie-{env}-workspace"

# ✅ GOOD: Add unique suffix
import random
import string

unique_suffix = ''.join(random.choices(string.digits, k=4))
workspace_name=f"genie-{env}-ws-{unique_suffix}"

# ✅ BETTER: Use subscription ID or hash
import hashlib

sub_id = config.get("subscription_id") or "default"
suffix = hashlib.md5(sub_id.encode()).hexdigest()[:6]
workspace_name=f"genie-{env}-ws-{suffix}"
```

---

### Advanced: Workspace with Custom Parameters

```python
workspace = azure_native.databricks.Workspace(
    "genie-workspace",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    workspace_name=f"genie-{env}-workspace",
    sku=azure_native.databricks.SkuArgs(name="premium"),
    managed_resource_group_id=resource_group.id,
    
    # Custom parameters
    parameters=azure_native.databricks.WorkspacePropertiesParametersArgs(
        # Production: disable public IP access
        enable_no_public_ip=(env == "prod"),
        
        # Enable encryption with customer-managed keys (enterprise)
        prepare_encryption=True,
        
        # Require secure cluster connectivity
        require_infrastructure_encryption=True
    ),
    
    # Default catalog
    default_catalog=azure_native.databricks.DefaultCatalogArgs(
        initial_name="genie_catalog",
        initial_type=azure_native.databricks.InitialType.UNITY_CATALOG
    ),
    
    # Custom tags
    tags={**common_tags, "DatabricksTier": "Premium"}
)
```

---

### Production: Private Link Configuration

```python
# For production environments with strict security
if env == "prod":
    workspace = azure_native.databricks.Workspace(
        "genie-workspace",
        resource_group_name=resource_group.name,
        location=resource_group.location,
        workspace_name=f"genie-{env}-workspace",
        sku=azure_native.databricks.SkuArgs(name="premium"),
        
        # Private link configuration
        parameters=azure_native.databricks.WorkspacePropertiesParametersArgs(
            enable_no_public_ip=True,
            prepare_encryption=True,
            custom_virtual_network_id="/subscriptions/.../resourceGroups/.../providers/Microsoft.Network/virtualNetworks/vnet-prod",
            custom_private_subnet_name="databricks-subnet"
        )
    )
```

---

## 3.5 Complete Infrastructure Module

### Full __main__.py

```python
"""
Genie Platform Infrastructure - Month 1

Provisions complete Azure + Databricks foundation:
- Resource Group
- Storage Account (Unity Catalog metastore)
- Databricks Workspace (Premium tier)
- Unity Catalog with standard schemas

Environments: dev, staging, prod
"""

import pulumi
import pulumi_azure_native as azure_native
from typing import Dict, Any
import hashlib

# =============================================================================
# Configuration
# =============================================================================

config = pulumi.Config()
env = config.get("environment") or "dev"
location = config.get("location") or "eastus"
subscription_id = config.get("subscription_id") or "default"

# Generate unique suffix for workspace name
workspace_suffix = hashlib.md5(f"{env}-{subscription_id}".encode()).hexdigest()[:6]

# Common tags for all resources
common_tags = {
    "Environment": env.upper(),
    "Project": "Genie",
    "ManagedBy": "Pulumi",
    "CostCenter": "Data-Platform",
    "Owner": "data-team@company.com"
}

print(f"🚀 Deploying Genie infrastructure for environment: {env.upper()}")
print(f"📍 Location: {location}")

# =============================================================================
# Resource Group
# =============================================================================

resource_group = azure_native.resources.ResourceGroup(
    "genie-rg",
    resource_group_name=f"genie-{env}-rg",
    location=location,
    tags=common_tags
)

print(f"✅ Resource Group: {resource_group.name}")

# =============================================================================
# Storage Account (Unity Catalog Metastore)
# =============================================================================

# Storage account name must be globally unique (3-24 chars, lowercase, no hyphens)
storage_suffix = hashlib.md5(f"{env}-storage".encode()).hexdigest()[:8]
storage_account_name = f"geniestg{env[:3]}{storage_suffix}"

storage_account = azure_native.storage.StorageAccount(
    "geniestorage",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    sku=azure_native.storage.SkuArgs(
        name="Standard_GRS" if env == "prod" else "Standard_LRS"
    ),
    kind="StorageV2",
    enable_https_traffic_only=True,
    minimum_tls_version="TLS1_2",
    allow_blob_public_access=False,
    
    # Enable soft delete for recovery
    blob_restore_policy=azure_native.storage.BlobRestorePolicyArgs(
        days=7 if env == "prod" else 1
    ),
    
    # Encryption settings
    encryption=azure_native.storage.EncryptionArgs(
        key_source="Microsoft.Storage",
        services=azure_native.storage.EncryptionServicesArgs(
            blob=azure_native.storage.EncryptionServiceArgs(
                enabled=True,
                key_type="Account"
            ),
            file=azure_native.storage.EncryptionServiceArgs(
                enabled=True,
                key_type="Account"
            )
        )
    ),
    
    tags=common_tags
)

print(f"✅ Storage Account: {storage_account.name}")

# Create container for Unity Catalog metastore
container = azure_native.storage.BlobContainer(
    "unitycatalogcontainer",
    resource_group_name=resource_group.name,
    account_name=storage_account.name,
    public_access=azure_native.storage.PublicAccess.NONE,
    metadata={
        "purpose": "unity-catalog-metastore",
        "environment": env
    }
)

print(f"✅ Storage Container: {container.name}")

# Get storage account key (for Databricks metastore)
storage_keys = azure_native.storage.list_storage_account_keys(
    resource_group_name=resource_group.name,
    account_name=storage_account.name
)

# =============================================================================
# Databricks Workspace
# =============================================================================

workspace = azure_native.databricks.Workspace(
    "genie-workspace",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    workspace_name=f"genie-{env}-ws-{workspace_suffix}",
    sku=azure_native.databricks.SkuArgs(name="premium"),
    managed_resource_group_id=resource_group.id,
    
    # Workspace parameters
    parameters=azure_native.databricks.WorkspacePropertiesParametersArgs(
        # Production: disable public IP for security
        enable_no_public_ip=(env == "prod"),
        
        # Enable encryption
        prepare_encryption=True,
        
        # Require secure cluster connectivity
        require_infrastructure_encryption=(env == "prod")
    ),
    
    # Default Unity Catalog
    default_catalog=azure_native.databricks.DefaultCatalogArgs(
        initial_name="genie_catalog",
        initial_type=azure_native.databricks.InitialType.UNITY_CATALOG
    ),
    
    tags={**common_tags, "DatabricksTier": "Premium"}
)

print(f"✅ Databricks Workspace: {workspace.workspace_name}")

# =============================================================================
# Outputs
# =============================================================================

# Storage URLs
blob_url = pulumi.Output.all(storage_account.name, container.name).apply(
    lambda args: f"https://{args[0]}.blob.core.windows.net/{args[1]}"
)

dfs_url = pulumi.Output.all(storage_account.name, container.name).apply(
    lambda args: f"abfss://{args[1]}@{args[0]}.dfs.core.windows.net/"
)

# Export all outputs
pulumi.export("resource_group_name", resource_group.name)
pulumi.export("resource_group_location", resource_group.location)
pulumi.export("storage_account_name", storage_account.name)
pulumi.export("storage_container_name", container.name)
pulumi.export("storage_account_key", 
    pulumi.Output.secret(storage_keys.keys[0].value)
)
pulumi.export("metastore_blob_url", blob_url)
pulumi.export("metastore_dfs_url", dfs_url)
pulumi.export("workspace_name", workspace.workspace_name)
pulumi.export("workspace_id", workspace.workspace_id)
pulumi.export("workspace_url", workspace.workspace_url)
pulumi.export("environment", env)

print(f"\n🎉 Deployment complete!")
print(f"📊 Workspace URL: https://{workspace.workspace_url}")
print(f"💾 Storage Account: {storage_account.name}")
print(f"📦 Container: {container.name}")
```

---

### Deployment Walkthrough

```bash
# Navigate to infrastructure directory
cd infrastructure

# Ensure correct stack is selected
pulumi stack select dev

# Preview changes
pulumi preview --diff

# Expected output:
# Previewing update (dev):
#   + azure-native:resources:ResourceGroup genie-rg create
#   + azure-native:storage:StorageAccount geniestorage create
#   + azure-native:storage:BlobContainer unitycatalogcontainer create
#   + azure-native:databricks:Workspace genie-workspace create
#
# Resources:
#   + 4 to create
#   0 to update
#   0 to delete

# Deploy
pulumi up

# Review the plan and type 'yes' to confirm
# Expected output:
# Updating (dev):
#  + azure-native:resources:ResourceGroup genie-rg created (3.2s)
#  + azure-native:storage:StorageAccount geniestorage create (15.4s)
#  + azure-native:storage:BlobContainer unitycatalogcontainer created (2.1s)
#  + azure-native:databricks:Workspace genie-workspace created (45.6s)
#
# Outputs:
#   environment              : "dev"
#   metastore_blob_url       : "https://geniestgdevabc123.blob.core.windows.net/unity-catalog"
#   metastore_dfs_url        : "abfss://unity-catalog@geniestgdevabc123.dfs.core.windows.net/"
#   resource_group_location  : "eastus"
#   resource_group_name      : "genie-dev-rg"
#   storage_account_key      : "[secret]"
#   storage_account_name     : "geniestgdevabc123"
#   storage_container_name   : "unity-catalog"
#   workspace_id             : "abc12345-6789-..."
#   workspace_name           : "genie-dev-ws-abc123"
#   workspace_url            : "adb-abc123456789.azuredatabricks.net"
#
# Resources:
#   + 4 created
#   0 updated
#   0 deleted

# Duration: 68s
```

---

### Verification Steps

```bash
# 1. Verify Resource Group
az group show --name genie-dev-rg --output table

# Expected:
# Location    Name           ProvisioningState
# ----------  -------------  -------------------
# eastus      genie-dev-rg   Succeeded

# 2. Verify Storage Account
az storage account show \
  --name geniestgdevabc123 \
  --resource-group genie-dev-rg \
  --query "[name,sku.name,creationTime]" \
  --output table

# Expected:
# Name              Sku     CreationTime
# ----------------  ------  -------------------------
# geniestgdevabc123  GRS    2024-04-20T10:30:00Z

# 3. Verify Container
az storage container list \
  --account-name geniestgdevabc123 \
  --output table

# Expected:
# Name            Lease    Last Modified
# --------------  -------  -------------------------
# unity-catalog   None     2024-04-20T10:31:00Z

# 4. Verify Databricks Workspace
az databricks workspace show \
  --name genie-dev-ws-abc123 \
  --resource-group genie-dev-rg \
  --query "[name,location,sku.tier,provisioningState]" \
  --output table

# Expected:
# Name                  Location    Sku       State
# --------------------  ----------  --------  -----------
# genie-dev-ws-abc123   eastus      Premium   Succeeded

# 5. Test Databricks CLI connectivity
databricks workspace list

# Expected: List of workspaces (may be empty initially)

# 6. Open workspace in browser
echo "https://$(pulumi stack output workspace_url)"
# Copy URL and open in browser
# Login with Azure AD credentials
```

---

## 3.6 Multi-Environment Deployment

### Deploy to All Environments

```bash
# Deploy dev environment
pulumi stack select dev
pulumi up

# Deploy staging environment
pulumi stack select staging
pulumi config set environment staging
pulumi up

# Deploy production environment
pulumi stack select prod
pulumi config set environment prod
pulumi config set location eastus  # Same region for now
pulumi up

# View all stacks
pulumi stack ls

# Expected:
# NAME        LAST UPDATE    RESOURCE COUNT
# dev*        2 minutes ago  4
# staging     5 minutes ago  4
# prod        10 minutes ago 4
```

---

### Environment-Specific Configuration

```bash
# Dev: smaller, cheaper resources
pulumi stack select dev
pulumi config set environment dev
pulumi config set workspace_sku premium

# Staging: similar to dev, but more storage
pulumi stack select staging
pulumi config set environment staging
pulumi config set storage_sku Standard_GRS  # Geo-redundant

# Production: largest, most secure
pulumi stack select prod
pulumi config set environment prod
pulumi config set workspace_sku premium
pulumi config set storage_sku Standard_GRS
pulumi config set enable_private_link true
pulumi config set --secret admin_password "super-secret-password"
```

---

### Stack Reference (Advanced)

```python
# infrastructure/prod/__main__.py
import pulumi

# Reference dev stack outputs
dev_stack = pulumi.StackReference("dev")
dev_workspace_url = dev_stack.get_output("workspace_url")

# Use dev workspace URL in prod configuration
# (e.g., for cross-environment testing)
pulumi.export("dev_workspace_url", dev_workspace_url)
```

---

## 3.7 Troubleshooting

### Common Issues and Solutions

#### Problem: "Storage account name already exists"

**Error:**
```
Error: Storage account name 'geniestgdev' is already in use.
```

**Solution:**
Storage account names must be globally unique. Add a unique suffix:

```python
import random
import string

# Add random 8-character suffix
suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
storage_account_name = f"geniestg{env[:3]}{suffix}"
```

---

#### Problem: "Workspace name conflicts"

**Error:**
```
Error: Workspace name 'genie-dev-workspace' is already in use in this region.
```

**Solution:**
Workspace names must be unique within the Azure region. Use a hash or GUID:

```python
import hashlib

# Create unique suffix from subscription ID
sub_id = config.get("subscription_id")
suffix = hashlib.md5(sub_id.encode()).hexdigest()[:6]
workspace_name = f"genie-{env}-ws-{suffix}"
```

---

#### Problem: "Insufficient permissions"

**Error:**
```
Error: AuthorizationFailed: The client does not have authorization to perform action...
```

**Solution:**
1. Check your Azure role:
```bash
az role assignment list --assignee <your-email> --output table
```

2. You need at least "Contributor" role on the subscription:
```bash
# Request role assignment
az role assignment create \
  --assignee <your-email> \
  --role "Contributor" \
  --scope /subscriptions/<subscription-id>
```

---

#### Problem: "Quota exceeded"

**Error:**
```
Error: OperationCouldNotBeCompleted: The subscription exceeded the quota for Databricks Workspaces.
```

**Solution:**
Azure subscriptions have default quotas. Request an increase:

1. Go to Azure Portal → Subscriptions → Your Subscription
2. Click "Usage + quotas"
3. Find "Databricks Workspaces"
4. Click "Request Increase"
5. Specify desired limit (e.g., 10 workspaces)

---

#### Problem: "Deployment stuck in progress"

**Error:**
```
Updating (dev):
  | azure-native:databricks:Workspace genie-workspace creating (20s)
  ... (stuck for 10+ minutes)
```

**Solution:**
1. Check Azure Portal for workspace status
2. If failed, check activity log for errors
3. Cancel Pulumi operation:
```bash
pulumi cancel
```

4. Refresh state:
```bash
pulumi refresh
```

5. Retry deployment:
```bash
pulumi up
```

---

#### Problem: "TLS/SSL certificate error"

**Error:**
```
Error: x509: certificate signed by unknown authority
```

**Solution:**
This usually happens with corporate proxies. Configure SSL cert:

```bash
# Set SSL certificate path
export SSL_CERT_FILE=/path/to/cert.pem

# Or disable SSL verification (NOT RECOMMENDED for production)
export PULUMI_TLS_INSECURE=true
```

---

## Summary

### What You've Accomplished

✅ Created resource groups for all environments  
✅ Provisioned storage accounts with proper security  
✅ Deployed Databricks workspaces (Premium tier)  
✅ Configured Unity Catalog metastore storage  
✅ Exported all necessary outputs  
✅ Verified deployments with Azure CLI  
✅ Deployed to dev, staging, and prod environments  

### Key Takeaways

1. **Resource Groups** provide logical isolation per environment
2. **Storage Accounts** need globally unique names and proper security settings
3. **Databricks Workspace** requires Premium SKU for Unity Catalog and Genie
4. **Unique Naming** is critical (use hashes or random suffixes)
5. **Tags** enable cost tracking and resource management
6. **Outputs** provide connection details for next steps

---

### Learning Checkpoint

**Q1: Why must storage account names be globally unique?**
<details>
<summary>Click to reveal answer</summary>

A: Storage accounts are accessed via public URLs (https://accountname.blob.core.windows.net). The account name is part of the DNS endpoint, so it must be unique across all of Azure.
</details>

**Q2: What's the minimum Databricks SKU required for Genie?**
<details>
<summary>Click to reveal answer</summary>

A: Premium tier. Standard tier doesn't include Unity Catalog, which is required for Genie.
</details>

**Q3: Why use separate resource groups per environment?**
<details>
<summary>Click to reveal answer</summary>

A: Separate RGs provide isolation, independent lifecycle management, easier RBAC, and clearer cost tracking. You can delete an entire environment by deleting one RG.
</details>

**Q4: What's the purpose of the storage container?**
<details>
<summary>Click to reveal answer</summary>

A: The container holds Unity Catalog metastore data: managed table files, Delta logs, and metadata. It's the foundational storage layer for all Unity Catalog tables.
</details>

**Q5: How do you prevent accidental deletion of production resources?**
<details>
<summary>Click to reveal answer</summary>

A: Use Azure Resource Locks (CanNotDelete level) and Pulumi's protect option. Also use separate stacks and require code reviews for production changes.
</details>

---

### Hands-On Exercises

#### 🎯 EXERCISE 3.1: Deploy Complete Infrastructure

**Task:** Deploy the full infrastructure module to dev environment

**Steps:**
1. Create `infrastructure/__main__.py` with complete code
2. Run `pulumi preview` and review changes
3. Deploy with `pulumi up`
4. Verify all 4 resources in Azure Portal
5. Export outputs and save for later chapters

**Deliverable:** Screenshot of successful deployment with all outputs

**Time:** 45 minutes

**Difficulty:** ⭐⭐⭐☆☆

---

#### 🎯 EXERCISE 3.2: Deploy to Multiple Environments

**Task:** Deploy identical infrastructure to dev, staging, and prod

**Steps:**
1. Create three stacks: dev, staging, prod
2. Configure environment-specific values
3. Deploy to each stack
4. Verify all three environments exist
5. Compare resource names and tags

**Deliverable:** Output of `pulumi stack ls` showing 3 stacks with resources

**Time:** 60 minutes

**Difficulty:** ⭐⭐⭐☆☆

---

#### 🎯 EXERCISE 3.3: Implement Resource Lock

**Task:** Add deletion protection to production resource group

**Steps:**
1. Add Lock resource to production stack
2. Deploy the lock
3. Try to delete the RG in Azure Portal (should fail)
4. Remove lock and verify deletion is allowed again

**Deliverable:** Screenshot of failed deletion attempt with error message

**Time:** 30 minutes

**Difficulty:** ⭐⭐⭐⭐☆

---

#### 🎯 EXERCISE 3.4: Cost Analysis

**Task:** Estimate monthly costs for all three environments

**Steps:**
1. Use Azure Pricing Calculator
2. Calculate costs for:
   - 3x Resource Groups (free)
   - 3x Storage Accounts (100GB each)
   - 3x Databricks Workspaces (Premium)
   - 3x SQL Warehouses (Small, 8hrs/day for dev/staging, 24/7 for prod)
3. Compare LRS vs GRS storage costs
4. Document total monthly estimate

**Deliverable:** Cost breakdown spreadsheet

**Time:** 40 minutes

**Difficulty:** ⭐⭐☆☆☆

---

### Next Steps

In **Chapter 4**, you'll:
- Configure the Databricks provider
- Create SQL Warehouses for Genie
- Set up user authentication
- Create initial clusters and policies

In **Chapter 5**, you'll:
- Bootstrap Unity Catalog metastore
- Create catalogs (dev/staging/prod)
- Create schemas (curated, certified_views, audit, genie_eval)
- Configure grants and permissions

---

**🎉 Congratulations! You've provisioned the complete Azure foundation!**

**Turn to Chapter 4 to continue building your Databricks platform.**

---
