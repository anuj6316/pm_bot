# Chapter 0: Getting Started

## What You'll Learn in This Chapter

By the end of this chapter, you will:
- ✅ Understand the complete architecture you'll build
- ✅ Have all required tools installed and configured
- ✅ Be authenticated to Azure and Databricks
- ✅ Have your first Pulumi project initialized
- ✅ Be ready to deploy real infrastructure

**Estimated Time:** 2-3 hours  
**Difficulty:** ⭐⭐☆☆☆ (Beginner)

---

## 0.1 What You'll Build

### Architecture Overview

You're building a complete Databricks Genie platform with three isolated environments:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Catalog    │  │   Catalog    │  │   Catalog    │      │
│  │  genie_prod  │  │  staging     │  │  dev         │      │
│  │              │  │              │  │              │      │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │      │
│  │  │curated │  │  │  │curated │  │  │  │curated │  │      │
│  │  │certified│ │  │  │certified│ │  │  │certified│ │      │
│  │  │audit   │  │  │  │audit   │  │  │  │audit   │  │      │
│  │  │genie   │  │  │  │genie   │  │  │  │genie   │  │      │
│  │  └────────┘  │  │  └────────┘  │  │  └────────┘  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Databricks Workspace (Premium)             │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │ SQL        │  │ SQL        │  │ SQL        │     │   │
│  │  │ Warehouse  │  │ Warehouse  │  │ Warehouse  │     │   │
│  │  │ (Prod)     │  │ (Staging)  │  │ (Dev)      │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴─────────┐
                    │  Unity Catalog    │
                    │    Metastore      │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Azure Storage    │
                    │   (ADLS Gen2)     │
                    └───────────────────┘
```

### Component Breakdown

**Azure Resources:**
1. **Resource Group** - Logical container for all resources
2. **Storage Account** - ADLS Gen2 for Unity Catalog metastore
3. **Databricks Workspace** - Premium tier for Genie features

**Databricks Resources:**
1. **Unity Catalog Metastore** - Centralized governance layer
2. **3 Catalogs** - dev, staging, prod (isolated environments)
3. **4 Schemas per Catalog** - curated, certified_views, audit, genie_eval
4. **3 SQL Warehouses** - One per environment for Genie queries

**Application Layer:**
1. **7+ Curated Tables** - Sample data for testing
2. **RBAC Matrix** - Role-based access control
3. **4+ Genie Spaces** - Natural language interfaces
4. **Benchmark Queries** - 210+ Q&A examples for training

### Learning Objectives by Month

**Month 1 (Weeks 1-4): Infrastructure Foundation**
- Week 1: Azure provisioning with Pulumi
- Week 2: Databricks workspace and Unity Catalog setup
- Week 3: Source control, CI/CD, and data foundation
- Week 4: RBAC design and benchmark query creation

**Month 2 (Weeks 5-8): Genie Configuration**
- Week 5: UC metadata enrichment and first Genie Spaces
- Week 6: Security policies and iterative training
- Week 7: Q&A examples and accuracy benchmarking
- Week 8: Final tuning and 85%+ accuracy gate

---

## 0.2 Prerequisites

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8GB | 16GB |
| Disk Space | 20GB free | 50GB free |
| CPU | Dual-core | Quad-core+ |
| Internet | 5 Mbps | 25+ Mbps |

**Why these requirements?**
- **RAM:** Python, Pulumi, and multiple browser tabs need memory
- **Disk:** Virtual environments, dependencies, and local state files
- **CPU:** Faster deployments and code compilation
- **Internet:** Cloud API calls and package downloads

---

### Software Requirements

#### Python 3.9+

**Check if installed:**
```bash
python --version
# Expected: Python 3.9.x or higher
```

**Install if needed:**

**Windows:**
```bash
# Download from https://www.python.org/downloads/
# During installation: CHECK "Add Python to PATH"
```

**macOS:**
```bash
# Using Homebrew
brew install python@3.9
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3.9 python3.9-venv python3-pip
```

**Verify pip:**
```bash
pip --version
# or
pip3 --version
```

---

#### Git

**Check if installed:**
```bash
git --version
# Expected: git version 2.x.x
```

**Install if needed:**

**Windows:**
```bash
# Download from https://git-scm.com/download/win
# Use default settings during installation
```

**macOS:**
```bash
# Using Homebrew
brew install git
```

**Linux:**
```bash
sudo apt install git
```

**Configure Git:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

#### Code Editor

**Recommended: Visual Studio Code**

Download: https://code.visualstudio.com/

**Essential Extensions:**
1. **Python** (Microsoft) - IntelliSense, linting, debugging
2. **Pulumi** (Pulumi) - Syntax highlighting, preview integration
3. **YAML** (Red Hat) - YAML syntax support
4. **GitLens** - Git blame and history
5. **Remote - SSH** (if working on remote servers)

**Alternative Editors:**
- PyCharm (full-featured IDE)
- Vim/Neovim (terminal-based, advanced users)
- Sublime Text (lightweight)

---

## 0.3 Tool Installation

### Pulumi CLI

**What is Pulumi CLI?**
The command-line interface for managing infrastructure as code. You'll use it to:
- Create and manage Pulumi projects
- Preview infrastructure changes
- Deploy resources to cloud providers
- View stack state and outputs

**Installation (Linux/macOS):**
```bash
# One-line install script
curl -fsSL https://get.pulumi.com | sh

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$PATH:$HOME/.pulumi/bin"

# Verify installation
pulumi version
# Expected: v3.x.x
```

**Installation (Windows):**
```bash
# Using PowerShell (run as Administrator)
iwr https://get.pulumi.com/install.ps1 -useb | iex

# Verify installation
pulumi version
```

**Installation (Alternative - pip):**
```bash
# Works on all platforms
pip install pulumi-cli

# Verify
pulumi version
```

---

### Pulumi Login Options

Pulumi needs to store state (tracking what resources exist). You have three options:

**Option 1: Pulumi Cloud (Recommended for Beginners)**
```bash
# Login to Pulumi Cloud (free for individuals)
pulumi login

# This opens a browser window
# Sign up/login with GitHub, Google, or email
# Free tier includes:
# - Unlimited stacks
# - 100GB state storage
# - Web-based state inspection
# - Rollback capabilities
```

**Option 2: Local File State (Offline/Testing)**
```bash
# Store state locally (no internet required)
pulumi login --local

# State stored in: ~/.pulumi/state
# Good for: Learning, offline development
# Not recommended for: Team collaboration
```

**Option 3: Azure Blob Storage (Enterprise)**
```bash
# Create storage account for state
az storage account create -n pulumistate -g pulumi-rg -l eastus --sku Standard_LRS

# Login to blob storage
pulumi login azblob://pulumi-state

# Requires Azure authentication
```

**Our Recommendation:** Start with Pulumi Cloud (Option 1). It's free, easy, and teaches cloud-native state management.

---

### Databricks CLI

**What is Databricks CLI?**
Command-line interface for interacting with Databricks workspace. You'll use it to:
- Verify workspace connectivity
- List catalogs, schemas, tables
- Run notebooks and jobs
- Debug Genie Spaces

**Installation (Linux/macOS):**
```bash
# One-line install script
curl -fsSL https://raw.githubusercontent.com/databricks/setup-cli/main/install.sh | sh

# Verify installation
databricks --version
# Expected: Databricks CLI v0.x.x
```

**Installation (Windows):**
```bash
# Using PowerShell (run as Administrator)
iwr https://raw.githubusercontent.com/databricks/setup-cli/main/install.ps1 -useb | iex

# Verify
databricks --version
```

**Alternative (pip):**
```bash
pip install databricks-cli

# Verify
databricks --version
```

---

### Azure CLI

**What is Azure CLI?**
Microsoft's command-line tool for Azure resource management. You'll use it to:
- Authenticate to Azure
- Create service principals
- Verify resource deployment
- Troubleshoot Azure issues

**Installation (Linux):**
```bash
# Ubuntu/Debian
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Verify
az --version
```

**Installation (macOS):**
```bash
# Using Homebrew
brew update && brew install azure-cli

# Verify
az --version
```

**Installation (Windows):**
```bash
# Download and run installer from:
# https://aka.ms/installazurecliwindows

# Or using PowerShell (run as Administrator)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# Verify
az --version
```

---

### Python Dependencies

**Create Project Directory:**
```bash
# Create main project folder
mkdir genie-platform
cd genie-platform

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

**Install Required Packages:**
```bash
# Create requirements.txt
cat > requirements.txt << EOF
# Infrastructure as Code
pulumi>=3.0.0
pulumi-azure-native>=2.0.0
pulumi-databricks>=1.0.0

# Databricks SDK
databricks-sdk>=0.20.0

# Data processing and utilities
pyyaml>=6.0
pytest>=7.0.0
python-dotenv>=1.0.0

# Code quality (optional but recommended)
black>=23.0.0
mypy>=1.0.0
EOF

# Install all dependencies
pip install -r requirements.txt

# Verify installations
python -c "import pulumi; print(f'Pulumi: {pulumi.__version__}')"
python -c "from databricks.sdk import WorkspaceClient; print('Databricks SDK: OK')"
python -c "import yaml; print('PyYAML: OK')"
```

**Expected Output:**
```
Pulumi: 3.x.x
Databricks SDK: OK
PyYAML: OK
```

---

## 0.4 Authentication Configuration

### Azure Authentication

**Why authenticate?**
Pulumi needs permissions to create Azure resources on your behalf.

**Option A: Azure CLI (Development - Recommended)**

This is the simplest method for local development.

```bash
# Login to Azure
az login

# This opens a browser window
# Select your subscription if prompted

# Set your subscription
az account set --subscription "<your-subscription-id>"

# Verify
az account show
# Look for: "id": "<your-subscription-id>"
```

**Find your Subscription ID:**
```bash
# List all subscriptions
az account list --output table

# Copy the ID of the subscription you want to use
```

**Option B: Service Principal (CI/CD - Production)**

For automated deployments, use a service principal (SPN).

```bash
# Create service principal with Contributor role
az ad sp create-for-rbac \
  --name "genie-pulumi-sp" \
  --role Contributor \
  --scopes "/subscriptions/<your-subscription-id>" \
  --sdk-auth

# Save the output! It contains:
# - clientId (ARM_CLIENT_ID)
# - clientSecret (ARM_CLIENT_SECRET)
# - tenantId (ARM_TENANT_ID)
# - subscriptionId (ARM_SUBSCRIPTION_ID)
```

**Store credentials securely:**
```bash
# NEVER commit these to Git!
# Add to .env file (gitignored)
cat > .env << EOF
export ARM_SUBSCRIPTION_ID="<subscription-id>"
export ARM_TENANT_ID="<tenant-id>"
export ARM_CLIENT_ID="<client-id>"
export ARM_CLIENT_SECRET="<client-secret>"
EOF

# Load environment variables
source .env
```

---

### Databricks Authentication

**Step 1: Generate Personal Access Token (PAT)**

1. **Login to Databricks Workspace**
   - Open your workspace URL in browser
   - Example: https://adb-<workspace-id>.azuredatabricks.net

2. **Navigate to User Settings**
   - Click your username (top-right)
   - Select "User Settings"

3. **Generate Access Token**
   - Go to "Access Tokens" tab
   - Click "Generate New Token"
   - Comment: "Pulumi CLI"
   - Lifetime: 90 days (or "No expiration" for dev)
   - Click "Generate"

4. **Copy Token Immediately**
   - ⚠️ **WARNING:** Token shown ONCE only!
   - Save it securely (password manager recommended)
   - Format: `dapiXXXXXXXXXXXXXXXXXXXXXXXX`

**Step 2: Configure Databricks CLI**

```bash
# Configure CLI with workspace details
databricks configure --host https://<your-workspace-id>.azuredatabricks.net

# When prompted, paste your PAT token
# (no echo - you won't see characters as you type)

# Verify configuration
cat ~/.databrickscfg
# Should show your host and token
```

**Step 3: Test Connection**

```bash
# List workspace contents
databricks workspace ls

# Expected output (may be empty):
# No files or folders found.

# List clusters (if any exist)
databricks clusters list

# Expected: Empty or list of existing clusters
```

**Troubleshooting:**
```
Error: "HTTP 401 Unauthorized"
Solution: Token expired or incorrect. Generate new token.

Error: "HTTP 404 Not Found"
Solution: Workspace URL incorrect. Check workspace ID.
```

---

### Environment Variables Setup

**Create .env File:**

```bash
# In your project root directory
cat > .env << EOF
# Azure Authentication
export ARM_SUBSCRIPTION_ID="<your-subscription-id>"
export ARM_TENANT_ID="<your-tenant-id>"
export ARM_CLIENT_ID="<your-client-id>"
export ARM_CLIENT_SECRET="<your-client-secret>"

# Databricks Authentication
export DATABRICKS_HOST="https://<workspace-id>.azuredatabricks.net"
export DATABRICKS_TOKEN="<your-pat-token>"

# Pulumi (if using Pulumi Cloud)
export PULUMI_ACCESS_TOKEN="<your-pulumi-token>"

# Project Configuration
export GENIE_ENVIRONMENT="dev"
export GENIE_LOCATION="eastus"
EOF
```

**Load Environment Variables:**

```bash
# Load into current shell session
source .env

# Verify
echo "Subscription: $ARM_SUBSCRIPTION_ID"
echo "Databricks Host: $DATABRICKS_HOST"
```

**Auto-load on Terminal Start:**

```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'source /path/to/genie-platform/.env' >> ~/.bashrc

# Reload
source ~/.bashrc
```

**⚠️ SECURITY WARNING:**
```
NEVER commit .env files to Git!
Add to .gitignore immediately:

echo ".env" >> .gitignore
echo "*.env" >> .gitignore
```

---

## 0.5 Initialize Pulumi Project

### Create Project Structure

```bash
# Navigate to project directory
cd genie-platform

# Initialize Pulumi Python project
pulumi new azure-python

# You'll be prompted for:
# - Project name: genie-platform
# - Project description: Databricks Genie Platform with Unity Catalog
# - Stack name: dev

# This creates:
# ├── Pulumi.yaml          # Project metadata
# ├── Pulumi.dev.yaml      # Dev stack configuration
# ├── __main__.py          # Entry point
# ├── requirements.txt     # Python dependencies
# └── README.md
```

### Understand Pulumi.yaml

```yaml
# Pulumi.yaml
name: genie-platform
runtime: python
description: Databricks Genie Platform with Unity Catalog
# This file identifies the directory as a Pulumi project
```

### Understand Pulumi.dev.yaml

```yaml
# Pulumi.dev.yaml
config:
  azure-native:location: eastus
  genie-platform:environment: dev
# Stack-specific configuration values
```

### Create Multiple Stacks

```bash
# Initialize staging stack
pulumi stack init staging

# Initialize prod stack
pulumi stack init prod

# List all stacks
pulumi stack ls

# Expected output:
# NAME        LAST UPDATE    RESOURCE COUNT
# dev*        2 minutes ago  0
# prod        Never          0
# staging     Never          0

# Switch between stacks
pulumi stack select dev
pulumi stack select staging
pulumi stack select prod
```

### Configure Stack Settings

```bash
# Set Azure location for all stacks
pulumi config set azure-native:location eastus

# Set environment-specific values
pulumi config set genie-platform:environment dev --stack dev
pulumi config set genie-platform:environment staging --stack staging
pulumi config set genie-platform:environment prod --stack prod

# Set secrets (automatically encrypted)
pulumi config set --secret genie-platform:databricks-token $DATABRICKS_TOKEN

# View configuration
pulumi config
```

---

## 0.6 Your First Pulumi Resource

### Minimal Example

Let's create a simple resource group to test everything works.

**Edit __main__.py:**

```python
"""
Pulumi Test Deployment
Creates a simple resource group to verify setup
"""

import pulumi
import pulumi_azure_native as azure_native

# Create resource group
resource_group = azure_native.resources.ResourceGroup(
    "test-rg",
    resource_group_name="test-genie-rg",
    location="eastus",
    tags={
        "Environment": "test",
        "Project": "genie-platform"
    }
)

# Export the resource group name
pulumi.export("resource_group_name", resource_group.name)
```

### Deploy the Resource

```bash
# Preview what will happen
pulumi preview

# Expected output:
# Previewing update (dev):
#  + azure-native:resources:ResourceGroup test-rg create
#
# Resources:
#   + 1 to create
#   0 to update
#   0 to delete

# Deploy to Azure
pulumi up

# Review the plan and type 'yes' to confirm
# Expected output:
# Updating (dev):
#  + azure-native:resources:ResourceGroup test-rg created (3.45s)
#
# Outputs:
#   resource_group_name: "test-genie-rg"
#
# Resources:
#   + 1 created
#   0 updated
#   0 deleted

# Duration: 5s
```

### Verify Deployment

```bash
# Check in Azure Portal
az group show --name test-genie-rg --output table

# Expected: Resource group details

# Check Pulumi state
pulumi stack

# Expected:
# Current stack: dev
# Resources:
#   + 1 created

# View outputs
pulumi stack output
# Expected:
# resource_group_name: "test-genie-rg"
```

### Clean Up

```bash
# Destroy the resource
pulumi destroy

# Type 'yes' to confirm
# Expected:
# Destroying (dev):
#   - azure-native:resources:ResourceGroup test-rg deleted (2.1s)
#
# Resources:
#   - 1 deleted
#   0 updated
#   0 created

# Duration: 3s
```

---

## 0.7 Understanding Pulumi Concepts

### Resources

**What is a Resource?**
A resource is a cloud infrastructure component that Pulumi manages.

**Examples:**
- Azure Resource Group
- Azure Storage Account
- Databricks Workspace
- Unity Catalog
- SQL Warehouse

**Resource Properties:**
```python
resource_group = azure_native.resources.ResourceGroup(
    "logical-name",        # Name in Pulumi code
    resource_group_name="actual-name",  # Name in Azure
    location="eastus",     # Property
    tags={"Env": "dev"}    # Property
)
```

### Stacks

**What is a Stack?**
A stack is a deployment environment (dev, staging, prod).

**Key Points:**
- Each stack has independent state
- Stacks can have different configurations
- Same code, different values
- Isolated deployments

**Stack Operations:**
```bash
# List stacks
pulumi stack ls

# Select stack
pulumi stack select dev

# Create new stack
pulumi stack init test

# Delete stack
pulumi stack rm test
```

### State

**What is State?**
State tracks the mapping between Pulumi code and real cloud resources.

**Why State Matters:**
- Pulumi knows what resources exist
- Enables `pulumi preview` to show changes
- Detects drift (manual changes)
- Supports rollback

**State Locations:**
- **Pulumi Cloud:** Managed state (recommended)
- **Local:** File-based state (`~/.pulumi/state`)
- **Azure Blob:** Self-managed state

### Outputs

**What are Outputs?**
Values exported from a stack for use by other stacks or scripts.

**Examples:**
```python
# Export resource names
pulumi.export("workspace_url", workspace.workspace_url)
pulumi.export("catalog_name", catalog.name)

# Export computed values
pulumi.export("storage_connection_string", 
    storage_account.id.apply(lambda id: f"abfss://{container}@{id}"))
```

**Use Outputs:**
```bash
# View outputs
pulumi stack output

# Get specific output
pulumi stack output workspace_url

# Use in scripts
WORKSPACE_URL=$(pulumi stack output workspace_url)
echo "Connect to: https://$WORKSPACE_URL"
```

---

## 0.8 Learning Checkpoint

### Knowledge Check

Answer these questions to verify understanding:

**Q1: What is Infrastructure as Code?**
<details>
<summary>Click to reveal answer</summary>

A: Managing infrastructure through code files instead of manual portal clicks. Benefits include version control, repeatability, and automated testing.
</details>

**Q2: What are the three Pulumi stack names we're using?**
<details>
<summary>Click to reveal answer</summary>

A: dev, staging, prod
</details>

**Q3: Where is Pulumi state stored by default?**
<details>
<summary>Click to reveal answer</summary>

A: Pulumi Cloud (free tier) when you run `pulumi login`
</details>

**Q4: Why should you never commit .env files to Git?**
<details>
<summary>Click to reveal answer</summary>

A: They contain secrets (tokens, passwords) that would be exposed publicly.
</details>

**Q5: What command shows what changes Pulumi will make?**
<details>
<summary>Click to reveal answer</summary>

A: `pulumi preview`
</details>

---

### Hands-On Exercises

#### 🎯 EXERCISE 0.1: Install All Tools

**Task:** Install and verify all required tools

**Steps:**
1. Install Python 3.9+ (if not already installed)
2. Install Pulumi CLI
3. Install Databricks CLI
4. Install Azure CLI
5. Verify all installations

**Deliverable:** Screenshot showing all version outputs

**Time:** 30 minutes

**Difficulty:** ⭐⭐☆☆☆

**Verification:**
```bash
python --version
pulumi version
databricks --version
az --version
```

---

#### 🎯 EXERCISE 0.2: Authenticate to All Services

**Task:** Configure authentication for Azure and Databricks

**Steps:**
1. Login to Azure with `az login`
2. Set subscription
3. Generate Databricks PAT token
4. Configure Databricks CLI
5. Create .env file with all credentials
6. Load environment variables

**Deliverable:** Successful test commands for both services

**Time:** 20 minutes

**Difficulty:** ⭐⭐☆☆☆

**Verification:**
```bash
az account show
databricks workspace ls
```

---

#### 🎯 EXERCISE 0.3: Deploy Your First Resource

**Task:** Create and destroy a resource group

**Steps:**
1. Initialize Pulumi project
2. Write resource group code
3. Run `pulumi preview`
4. Deploy with `pulumi up`
5. Verify in Azure Portal
6. Destroy with `pulumi destroy`

**Deliverable:** Screenshot of successful deployment and destruction

**Time:** 25 minutes

**Difficulty:** ⭐⭐☆☆☆

**Verification:**
```bash
pulumi preview
pulumi up
az group show --name test-genie-rg
pulumi destroy
```

---

#### 🎯 EXERCISE 0.4: Create Multiple Stacks

**Task:** Set up dev, staging, and prod stacks

**Steps:**
1. Create dev stack (already exists)
2. Create staging stack
3. Create prod stack
4. Configure different values for each
5. List all stacks
6. Switch between stacks

**Deliverable:** Output of `pulumi stack ls` showing 3 stacks

**Time:** 15 minutes

**Difficulty:** ⭐⭐☆☆☆

**Verification:**
```bash
pulumi stack ls
pulumi config
```

---

### Troubleshooting

#### Common Issues

**Problem:** `pulumi preview` fails with "authentication required"

**Solution:**
```bash
# Re-login to Azure
az login

# Verify subscription
az account show

# If needed, set subscription
az account set --subscription "<subscription-id>"
```

---

**Problem:** Databricks CLI returns "401 Unauthorized"

**Solution:**
```bash
# Token likely expired or incorrect
# Generate new PAT token in Databricks workspace
# Reconfigure CLI
databricks configure --host https://<workspace>.azuredatabricks.net
```

---

**Problem:** Python import errors

**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

**Problem:** Pulumi state conflicts

**Solution:**
```bash
# Refresh state from cloud
pulumi refresh

# If still issues, cancel any stuck operations
pulumi cancel
```

---

## Summary

### What You've Accomplished

✅ Installed all required tools (Pulumi, Databricks CLI, Azure CLI)  
✅ Configured authentication for Azure and Databricks  
✅ Created your first Pulumi project  
✅ Deployed a test resource to Azure  
✅ Understood Pulumi stacks and state management  
✅ Set up multiple environments (dev, staging, prod)  

### What's Next

In **Chapter 1**, you'll learn:
- Infrastructure as Code fundamentals
- Why IaC is essential for production
- Pulumi vs. Terraform comparison
- State management deep-dive

In **Chapter 2**, you'll master:
- Python patterns for infrastructure
- Resource dependencies
- Component resources
- Configuration management

### Key Takeaways

1. **Tools are installed and configured** - You have everything needed
2. **Authentication is secure** - Using environment variables, not hardcoded secrets
3. **Pulumi is working** - You successfully deployed a resource
4. **Multiple environments ready** - dev, staging, prod stacks configured
5. **Foundation complete** - Ready to build real infrastructure

---

**🎉 Congratulations! You're ready to build production infrastructure!**

**Turn to Chapter 1 to continue your journey.**

---
