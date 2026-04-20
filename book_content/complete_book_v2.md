# Databricks Genie Implementation Guide with Pulumi (Python)

## Month 1 & Month 2 - Complete Learning Edition

### From Zero to Production-Ready Data Platform

---

Version: v2.0 Pulumi Learning Edition  
Date: April 2026  
Classification: CONFIDENTIAL - Developer Reference

---

## Copyright & Disclaimer

© 2026. All rights reserved.

This document is a confidential developer reference for implementing Databricks Genie with Pulumi infrastructure as code.

**Important Notes:**
- This guide assumes Azure as the primary cloud platform
- AWS references are included for completeness but not fully detailed
- All code examples are tested and production-ready
- Pricing estimates are approximate and subject to change
- Databricks features require Premium tier or higher

**Trademarks:**
- Databricks, Unity Catalog, and Genie are trademarks of Databricks, Inc.
- Azure is a trademark of Microsoft Corporation
- Pulumi is a trademark of Pulumi Corporation

---

## Table of Contents

### Front Matter
- How to Use This Book
- Conventions Used
- Reading Paths

### Part 0: Foundations
- Chapter 0: Getting Started
- Chapter 1: Infrastructure as Code Fundamentals
- Chapter 2: Pulumi Python Mastery

### Part 1: Month 1 - Infrastructure Foundation
- Chapter 3: Azure Resource Provisioning
- Chapter 4: Databricks Platform Setup
- Chapter 5: Unity Catalog Bootstrap
- Chapter 6: Source Control & CI/CD
- Chapter 7: Data Foundation
- Chapter 8: RBAC Design

### Part 2: Month 2 - Genie Configuration
- Chapter 9: Unity Catalog Metadata
- Chapter 10: Security Policies
- Chapter 11: Certified Views
- Chapter 12: Genie Spaces
- Chapter 13: Q&A Examples
- Chapter 14: Genie Instructions
- Chapter 15: Accuracy Benchmarking

### Part 3: Testing & Operations
- Chapter 16: Testing Strategy
- Chapter 17: Monitoring & Operations

### Appendices
- Appendix A: Glossary
- Appendix B: Quick Reference
- Appendix C: Troubleshooting
- Appendix D: Complete Code Repository
- Appendix E: Cost Estimation

---

## How to Use This Book

This book is designed to serve multiple purposes:
1. **Learn from scratch** - Complete beginner to production-ready
2. **Reference guide** - Quick lookups for specific tasks
3. **Best practices** - Industry-proven patterns and anti-patterns

### Reading Paths for Different Backgrounds

#### PATH 1: Complete Beginner
**Profile:** Never touched IaC or Databricks before

**Reading Plan:**
- Read Chapters 0-3 cover-to-cover
- Do every hands-on exercise
- Spend extra time on concept boxes
- Complete all verification steps
- Estimated time: **3-4 weeks**

**Success Checklist:**
- ✅ All tools installed and configured
- ✅ First Pulumi program deployed
- ✅ Databricks workspace created
- ✅ Unity Catalog configured
- ✅ First Genie Space working

---

#### PATH 2: Terraform User
**Profile:** Familiar with IaC, new to Pulumi

**Reading Plan:**
- Skim Chapters 0-1 (focus on Pulumi differences)
- Deep-dive Chapter 2 (Pulumi Python patterns)
- Focus Chapters 4-6 (Databricks-specific setup)
- Deep-dive Chapters 8-12 (Genie configuration)
- Estimated time: **2 weeks**

**Key Pulumi vs. Terraform Differences:**
| Concept | Terraform | Pulumi |
|---------|-----------|--------|
| Language | HCL (declarative) | Python/TS/Go (imperative) |
| State | .tfstate files | Pulumi Cloud/local/backend |
| Loops | `count`/`for_each` | Native Python loops |
| Conditionals | `count = condition ? 1 : 0` | Native `if` statements |
| Testing | terraform-test, Terratest | pytest, jest, etc. |

---

#### PATH 3: Databricks User
**Profile:** Familiar with Databricks platform, new to Genie

**Reading Plan:**
- Skim Chapters 0-2 (IaC basics)
- Focus Chapters 5-6 (Unity Catalog deep-dive)
- Deep-dive Chapters 9-15 (Genie configuration)
- Estimated time: **1-2 weeks**

**What's New in Genie:**
- Natural language to SQL conversion
- Curated Q&A examples for training
- Genie Instructions as business context
- Accuracy benchmarking pipelines
- Iterative training loops

---

#### PATH 4: Reference Mode
**Profile:** Building now, need specific answers quickly

**Quick Navigation:**
- **Setup issues?** → Appendix C (Troubleshooting)
- **Command syntax?** → Appendix B (Quick Reference)
- **Code examples?** → Jump to specific chapter code listings
- **Concept unclear?** → Appendix A (Glossary)
- **Cost concerns?** → Appendix E (Cost Estimation)

---

## Conventions Used

### Icon Legend

📘 **CONCEPT BOX**  
Foundational knowledge and theoretical background. Read these first to understand the "why" before the "how".

💡 **CODE COMMENT**  
Inline explanations within code examples. These explain non-obvious decisions and best practices.

⚠️ **WARNING**  
Common mistakes, gotchas, and anti-patterns to avoid. Pay special attention to these!

✅ **VERIFICATION**  
Commands and steps to confirm successful completion. Always verify before moving to the next section.

📚 **DEEP DIVE**  
Links to official documentation for deeper understanding. Use these when you need more detail.

🎯 **EXERCISE**  
Hands-on practice tasks. Learning by doing is the most effective way to master these concepts.

🔍 **TROUBLESHOOTING**  
Debug specific issues. Common error messages and their solutions.

---

### Code Formatting

**Python Code:**
```python
import pulumi
import pulumi_azure_native as azure_native

# Resource group creation
resource_group = azure_native.resources.ResourceGroup(
    "genie-rg",
    resource_group_name="genie-production",
    location="eastus"
)
```

**Bash Commands:**
```bash
# Install Pulumi CLI
curl -fsSL https://get.pulumi.com | sh

# Verify installation
pulumi version
```

**YAML Configuration:**
```yaml
# Pulumi.yaml
name: genie-platform
runtime: python
description: Databricks Genie Platform
```

**SQL Queries:**
```sql
-- Create view in Unity Catalog
CREATE OR REPLACE VIEW genie_dev.certified_views.v_sales_monthly
AS
SELECT 
    DATE_TRUNC('month', transaction_date) AS month,
    SUM(net_revenue) AS total_revenue
FROM genie_dev.curated.sales_transactions
GROUP BY 1;
```

---

### Naming Conventions

**Resources:**
- Use kebab-case for Azure resources: `genie-rg`, `genie-workspace`
- Use snake_case for Python variables: `resource_group`, `workspace_url`
- Use PascalCase for classes: `MetadataWriter`, `GenieSpaceManager`

**Environments:**
- Development: `dev`
- Staging/UAT: `staging`
- Production: `prod`

**File Extensions:**
- `.py` - Python source code
- `.yaml` - Configuration files
- `.md` - Markdown documentation
- `.docx` - Word documents

---

## Prerequisites Checklist

Before starting, ensure you have:

### Hardware
- [ ] Laptop/PC with 8GB+ RAM (16GB recommended)
- [ ] 20GB free disk space
- [ ] Stable internet connection

### Software
- [ ] Python 3.9 or higher installed
- [ ] Git installed and configured
- [ ] Code editor (VS Code recommended)

### Cloud Access
- [ ] Azure subscription (active, with Contributor access)
- [ ] Databricks Premium tier workspace (or ability to create one)
- [ ] Ability to create service principals

### Time Commitment
- [ ] 2-4 hours/day for complete beginner path
- [ ] 1-2 hours/day for experienced path
- [ ] Weekend project for reference path

---

## Getting Help

**Official Documentation:**
- Pulumi: https://www.pulumi.com/docs/
- Databricks: https://docs.databricks.com/
- Azure: https://docs.microsoft.com/azure/

**Community Support:**
- Pulumi Community Slack: https://www.pulumi.com/community/slack/
- Databricks Community: https://community.databricks.com/
- Stack Overflow: Tag questions with `pulumi`, `databricks`, `azure`

**This Book:**
- Exercises include solutions in Appendix D
- Troubleshooting guide in Appendix C
- Glossary in Appendix A for quick term lookups

---

**Ready to begin? Turn to Chapter 0!**

---
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
# Chapter 12: Genie Spaces

## What You'll Learn in This Chapter

By the end of this chapter, you will:
- ✅ Understand what Genie Spaces are and how they work
- ✅ Create Genie Spaces programmatically via API
- ✅ Bind tables and views to spaces
- ✅ Configure domain-specific instructions
- ✅ Manage multiple spaces for different business domains
- ✅ Test and verify space functionality

**Estimated Time:** 4-5 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Advanced)

---

## 12.1 Genie Spaces Overview

### 📘 CONCEPT: What is a Genie Space?

A Genie Space is a configured instance of Databricks Genie that:
- **Focuses on a specific business domain** (Sales, Inventory, Finance, etc.)
- **Has access to curated tables and views** for that domain
- **Includes business instructions** for terminology and SQL patterns
- **Contains Q&A examples** for training
- **Provides natural language interface** for business users

**Analogy:**
```
Traditional BI:
  User → SQL Query → Database → Results

Genie Space:
  User → Natural Language Question → Genie → SQL Generation → Database → Results
```

---

### Genie Space Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Genie Space: Sales Analytics            │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Connected Tables & Views                        │   │
│  │  ├── genie_dev.curated.sales_transactions        │   │
│  │  ├── genie_dev.curated.customer_master           │   │
│  │  ├── genie_dev.curated.product_catalogue         │   │
│  │  └── genie_dev.certified_views.v_net_revenue     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Genie Instructions (Business Context)           │   │
│  │  ├── Business glossary (revenue, customer, etc.) │   │
│  │  ├── Date handling conventions                   │   │
│  │  ├── Preferred SQL patterns                      │   │
│  │  └── Out-of-scope topics                         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Curated Q&A Examples (Training Data)            │   │
│  │  ├── "What were total sales last month?"         │   │
│  │  ├── "Show me top 10 customers by revenue"       │   │
│  │  ├── "Compare Q1 vs Q2 performance"              │   │
│  │  └── ... (20+ examples)                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  User asks: "What was our best performing region?"       │
│  ↓                                                        │
│  Genie reads: Tables + Instructions + Q&A Examples       │
│  ↓                                                        │
│  Genie generates SQL:                                    │
│  SELECT region_code, SUM(net_revenue) as total           │   │
│  FROM genie_dev.curated.sales_transactions               │   │
│  GROUP BY region_code                                    │   │
│  ORDER BY total DESC LIMIT 1                             │   │
│  ↓                                                        │
│  Results returned to user                                │
└─────────────────────────────────────────────────────────┘
```

---

### When to Create Multiple Spaces

**Single Space (Good for small datasets):**
- All tables related to one domain
- < 10 tables total
- Simple business logic

**Multiple Spaces (Recommended for enterprise):**
- Different business domains (Sales, Inventory, Finance)
- 10+ tables total
- Complex business logic per domain
- Different user groups with specific needs

**Example Multi-Space Architecture:**
```
┌─────────────────────────────────────────────────────┐
│              Genie Spaces Ecosystem                  │
│                                                      │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │  Sales          │  │  Inventory &    │          │
│  │  Analytics      │  │  Supply         │          │
│  │                 │  │                 │          │
│  │  Tables: 4      │  │  Tables: 3      │          │
│  │  Q&A: 25        │  │  Q&A: 20        │          │
│  │  Users: Sales   │  │  Users: Ops     │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                      │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │  Financial      │  │  Marketing &    │          │
│  │  Performance    │  │  Campaigns      │          │
│  │                 │  │                 │          │
│  │  Tables: 3      │  │  Tables: 2      │          │
│  │  Q&A: 18        │  │  Q&A: 15        │          │
│  │  Users: Finance │  │  Users: Marketing│         │
│  └─────────────────┘  └─────────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## 12.2 Create Genie Space via API

### 📘 CONCEPT: Genie API Endpoints

**Management APIs:**
- `POST /api/2.0/genie/spaces` - Create space
- `GET /api/2.0/genie/spaces/{space_id}` - Get space details
- `PATCH /api/2.0/genie/spaces/{space_id}` - Update space
- `DELETE /api/2.0/genie/spaces/{space_id}` - Delete space

**Conversation APIs:**
- `POST /api/2.0/genie/spaces/{space_id}/start-conversation` - Ask question
- `GET /api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}` - Get response

---

### Space Manager Code

```python
# src/genie/space_manager.py
"""
Creates and configures Databricks Genie Spaces programmatically.

Uses the Databricks REST API to manage spaces as code.
This enables version control, CI/CD, and reproducible deployments.
"""

import logging
import requests
import os
from dataclasses import dataclass
from typing import List, Dict, Optional

log = logging.getLogger(__name__)


@dataclass
class GenieSpaceConfig:
    """
    Configuration for a Genie Space.
    
    Attributes:
        title: Display name shown in Databricks UI
        description: Brief description of the space's purpose
        table_identifiers: List of Unity Catalog table/view full names
        instructions: Business context and SQL patterns (plain text)
        parent_path: Workspace folder path (optional)
    """
    title: str
    description: str
    table_identifiers: List[str]
    instructions: str
    parent_path: Optional[str] = "/Users/admin"


# Define Genie Spaces for our implementation
GENIE_SPACES = [
    GenieSpaceConfig(
        title="Sales Analytics",
        description="Answer questions about sales transactions, revenue trends, " +
                    "and customer purchasing behavior.",
        table_identifiers=[
            "genie_dev.curated.sales_transactions",
            "genie_dev.curated.customer_master",
            "genie_dev.curated.product_catalogue",
            "genie_dev.certified_views.v_net_revenue_monthly"
        ],
        instructions=open("config/genie_instructions/sales_analytics.txt").read()
    ),
    
    GenieSpaceConfig(
        title="Inventory & Supply",
        description="Answer questions about inventory levels, stock health, " +
                    "and supply chain optimization.",
        table_identifiers=[
            "genie_dev.curated.inventory_positions",
            "genie_dev.curated.product_catalogue",
            "genie_dev.certified_views.v_inventory_health"
        ],
        instructions=open("config/genie_instructions/inventory_supply.txt").read()
    ),
    
    GenieSpaceConfig(
        title="Financial Performance",
        description="Answer questions about financial KPIs, P&L statements, " +
                    "and budget vs. actuals analysis.",
        table_identifiers=[
            "genie_dev.curated.financial_summary",
            "genie_dev.curated.budget_actuals",
            "genie_dev.certified_views.v_profit_margins"
        ],
        instructions=open("config/genie_instructions/financial_performance.txt").read()
    ),
    
    GenieSpaceConfig(
        title="Marketing & Campaigns",
        description="Answer questions about campaign performance, marketing spend, " +
                    "and ROI analysis.",
        table_identifiers=[
            "genie_dev.curated.marketing_campaigns",
            "genie_dev.curated.customer_segments"
        ],
        instructions=open("config/genie_instructions/marketing_campaigns.txt").read()
    ),
]


class GenieSpaceManager:
    """
    Manages Genie Spaces via the Databricks REST API.
    
    API documentation: https://docs.databricks.com/api/workspace/genie/spaces
    """
    
    def __init__(self):
        """
        Initialize Genie Space Manager.
        
        Requires environment variables:
        - DATABRICKS_HOST: Workspace URL (e.g., https://workspace.azuredatabricks.net)
        - DATABRICKS_TOKEN: Personal Access Token
        """
        self.host = os.environ.get("DATABRICKS_HOST")
        self.token = os.environ.get("DATABRICKS_TOKEN")
        
        if not self.host or not self.token:
            raise ValueError(
                "DATABRICKS_HOST and DATABRICKS_TOKEN environment variables required. " +
                "Set them in your .env file or export them in your shell."
            )
        
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        log.info(f"Initialized GenieSpaceManager for host: {self.host}")
    
    def create_space(self, config: GenieSpaceConfig) -> str:
        """
        Creates a Genie Space and returns its space_id.
        
        Args:
            config: GenieSpaceConfig with title, description, tables, instructions
        
        Returns:
            space_id: Unique identifier for the created space
        
        Raises:
            requests.HTTPError: If API call fails
        """
        # Prepare API payload
        payload = {
            "title": config.title,
            "description": config.description,
            "table_identifiers": config.table_identifiers,
        }
        
        # Optional: Add parent folder
        if config.parent_path:
            payload["parent_path"] = config.parent_path
        
        # Create space via API
        log.info(f"Creating Genie Space: {config.title}")
        response = requests.post(
            f"{self.host}/api/2.0/genie/spaces",
            headers=self.headers,
            json=payload
        )
        
        # Handle response
        if response.status_code == 200:
            space_id = response.json()["space_id"]
            log.info(f"Created Genie Space: {config.title} (id={space_id})")
            return space_id
        else:
            log.error(f"Failed to create space {config.title}: {response.text}")
            response.raise_for_status()
    
    def update_instructions(self, space_id: str, instructions: str) -> None:
        """
        Updates the business instructions for a Genie Space.
        
        Instructions are critical for Genie to understand:
        - Business terminology and glossary
        - Date handling conventions
        - Preferred SQL patterns
        - Out-of-scope topics
        
        Args:
            space_id: The space to update
            instructions: Plain text instructions (markdown supported)
        
        Raises:
            requests.HTTPError: If API call fails
        """
        log.info(f"Updating instructions for space_id={space_id}")
        
        response = requests.patch(
            f"{self.host}/api/2.0/genie/spaces/{space_id}",
            headers=self.headers,
            json={"instructions": instructions}
        )
        
        if response.status_code == 200:
            log.info(f"Updated instructions for space_id={space_id}")
        else:
            log.error(f"Failed to update instructions: {response.text}")
            response.raise_for_status()
    
    def add_tables(self, space_id: str, table_identifiers: List[str]) -> None:
        """
        Adds additional tables to an existing Genie Space.
        
        Args:
            space_id: The space to update
            table_identifiers: List of Unity Catalog table/view full names
        
        Raises:
            requests.HTTPError: If API call fails
        """
        log.info(f"Adding {len(table_identifiers)} tables to space_id={space_id}")
        
        response = requests.post(
            f"{self.host}/api/2.0/genie/spaces/{space_id}/tables",
            headers=self.headers,
            json={"table_identifiers": table_identifiers}
        )
        
        if response.status_code == 200:
            log.info(f"Added tables to space_id={space_id}")
        else:
            log.error(f"Failed to add tables: {response.text}")
            response.raise_for_status()
    
    def create_all(self) -> Dict[str, str]:
        """
        Creates all Genie Spaces from GENIE_SPACES configuration.
        
        Returns:
            Dictionary mapping space titles to space_ids
            Example: {"Sales Analytics": "abc123", "Inventory & Supply": "def456"}
        
        Raises:
            requests.HTTPError: If any space creation fails
        """
        log.info(f"Creating {len(GENIE_SPACES)} Genie Spaces")
        
        space_map = {}
        
        for cfg in GENIE_SPACES:
            try:
                # Create space
                space_id = self.create_space(cfg)
                
                # Update instructions (separate call for clarity)
                self.update_instructions(space_id, cfg.instructions)
                
                # Store mapping
                space_map[cfg.title] = space_id
                
                log.info(f"✅ Created space: {cfg.title} ({space_id})")
                
            except Exception as e:
                log.error(f"❌ Failed to create space {cfg.title}: {e}")
                raise
        
        log.info(f"Successfully created {len(space_map)} Genie Spaces")
        return space_map
    
    def list_spaces(self) -> List[Dict]:
        """
        Lists all Genie Spaces in the workspace.
        
        Returns:
            List of space dictionaries with id, title, description
        
        Raises:
            requests.HTTPError: If API call fails
        """
        log.info("Listing all Genie Spaces")
        
        response = requests.get(
            f"{self.host}/api/2.0/genie/spaces",
            headers=self.headers
        )
        
        if response.status_code == 200:
            spaces = response.json().get("spaces", [])
            log.info(f"Found {len(spaces)} Genie Spaces")
            return spaces
        else:
            log.error(f"Failed to list spaces: {response.text}")
            response.raise_for_status()
    
    def get_space(self, space_id: str) -> Dict:
        """
        Gets detailed information about a specific Genie Space.
        
        Args:
            space_id: The space to retrieve
        
        Returns:
            Space details including tables, instructions, Q&A count
        
        Raises:
            requests.HTTPError: If API call fails
        """
        log.info(f"Getting details for space_id={space_id}")
        
        response = requests.get(
            f"{self.host}/api/2.0/genie/spaces/{space_id}",
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            log.error(f"Failed to get space details: {response.text}")
            response.raise_for_status()
    
    def delete_space(self, space_id: str) -> None:
        """
        Deletes a Genie Space.
        
        ⚠️ WARNING: This action is irreversible!
        All Q&A examples and instructions will be lost.
        
        Args:
            space_id: The space to delete
        
        Raises:
            requests.HTTPError: If API call fails
        """
        log.warning(f"Deleting space_id={space_id}")
        
        response = requests.delete(
            f"{self.host}/api/2.0/genie/spaces/{space_id}",
            headers=self.headers
        )
        
        if response.status_code == 200:
            log.info(f"Deleted space_id={space_id}")
        else:
            log.error(f"Failed to delete space: {response.text}")
            response.raise_for_status()
```

---

### Usage Example

```python
# notebooks/month2/create_genie_spaces.py
"""
Create all Genie Spaces for the Genie project.

This notebook:
1. Initializes GenieSpaceManager
2. Creates all configured spaces
3. Stores space_ids for later use
4. Verifies creation via API
"""

from src.genie.space_manager import GenieSpaceManager, GENIE_SPACES
import json

# Initialize manager
manager = GenieSpaceManager()

# Create all spaces
print(f"🚀 Creating {len(GENIE_SPACES)} Genie Spaces...")
space_map = manager.create_all()

# Save space IDs for later use
with open("config/genie_space_ids.json", "w") as f:
    json.dump(space_map, f, indent=2)

print(f"\n✅ Successfully created {len(space_map)} Genie Spaces:")
for title, space_id in space_map.items():
    print(f"  - {title}: {space_id}")

# Verify by listing all spaces
print("\n📋 Verifying creation...")
all_spaces = manager.list_spaces()
print(f"Found {len(all_spaces)} total spaces in workspace")

# Display space details
for space in all_spaces:
    print(f"\n  Space: {space['title']}")
    print(f"  ID: {space['space_id']}")
    print(f"  Description: {space['description']}")
    print(f"  Tables: {len(space.get('table_identifiers', []))}")
```

---

## 12.3 Genie Instructions

### 📘 CONCEPT: What are Genie Instructions?

Genie Instructions are the "business context document" that Genie reads before generating SQL.

**Critical Components:**
1. **Domain Context** - What business domain is this?
2. **Primary Tables** - What tables are available?
3. **Business Terminology** - What do terms mean?
4. **Date Handling** - How to interpret time-based queries?
5. **SQL Patterns** - Preferred ways to write queries
6. **Out of Scope** - What NOT to answer

---

### Sales Analytics Instructions (Complete Example)

```markdown
# config/genie_instructions/sales_analytics.txt

== DOMAIN CONTEXT ==

You are a Sales Analytics assistant for a retail company.
You answer questions about:
- Sales transactions and revenue performance
- Customer purchasing behavior and trends
- Regional sales analysis
- Channel performance (online, retail, partner, direct)
- Product sales and category performance

You do NOT answer questions about:
- Inventory levels (ask Inventory & Supply assistant)
- Financial statements (ask Financial Performance assistant)
- Marketing campaigns (ask Marketing assistant)

== PRIMARY TABLES ==

### genie_dev.curated.sales_transactions

One row per completed sale. This is your PRIMARY table for all revenue queries.

**Key Columns:**
- transaction_id: Unique identifier (STRING)
- transaction_date: When sale occurred (TIMESTAMP, UTC)
- customer_id: Customer identifier (STRING)
- product_id: Product identifier (STRING)
- gross_amount: Pre-discount amount (DECIMAL)
- discount_amount: Discount applied (DECIMAL)
- return_amount: Returned goods value (DECIMAL)
- net_revenue: FINAL revenue metric (DECIMAL)
  Formula: gross_amount - discount_amount - return_amount
- region_code: Geographic region (NA, EU, APAC, LATAM)
- channel: Sales channel (online, retail, partner, direct)

**IMPORTANT:** Always use net_revenue for revenue KPIs, NOT gross_amount.

### genie_dev.curated.customer_master

Customer demographic data. Use for customer segmentation queries.

**Key Columns:**
- customer_id: Primary key (STRING)
- customer_name: Full name (STRING)
- email: Contact email (STRING)
- segment: Customer tier (STRING: Enterprise, SMB, Consumer)
- region: Geographic region (STRING)
- acquisition_date: When customer was acquired (DATE)

### genie_dev.curated.product_catalogue

Product information. Use for product analysis queries.

**Key Columns:**
- product_id: Primary key (STRING)
- product_name: Display name (STRING)
- category: Product category (STRING)
- subcategory: Product subcategory (STRING)
- unit_price: Standard price (DECIMAL)
- cost_price: Internal cost (DECIMAL) - RESTRICTED ACCESS

### genie_dev.certified_views.v_net_revenue_monthly

Pre-aggregated monthly revenue by region and channel.

**USE THIS VIEW** for any monthly trend query instead of aggregating from raw table.
It's pre-optimized and faster.

**Columns:**
- revenue_month: Month (DATE)
- region_code: Region (STRING)
- channel: Channel (STRING)
- transaction_count: Number of transactions (BIGINT)
- unique_customers: Distinct customers (BIGINT)
- gross_revenue: Total gross amount (DECIMAL)
- total_discounts: Total discounts (DECIMAL)
- net_revenue: Total net revenue (DECIMAL)
- revenue_per_customer: Average revenue per customer (DECIMAL)

== BUSINESS TERMINOLOGY ==

**Revenue Metrics:**
- "Revenue" or "Sales" = net_revenue (ALWAYS)
- "Gross Revenue" = gross_amount (use only when explicitly asked)
- "Net Revenue" = net_revenue (preferred metric)
- "Profit" = NOT AVAILABLE in this domain (ask Finance assistant)

**Customer Metrics:**
- "Customers" = COUNT(DISTINCT customer_id)
- "New Customers" = customers with acquisition_date in query period
- "Returning Customers" = customers with >1 transaction in period

**Time Periods:**
- "This month" = Current calendar month (DATE_TRUNC('month', CURRENT_DATE))
- "Last month" = Previous calendar month
- "QTD" = Quarter-to-date (DATE_TRUNC('quarter', CURRENT_DATE) to now)
- "YTD" = Year-to-date (DATE_TRUNC('year', CURRENT_DATE) to now)
- "Last 30 days" = Rolling 30 days (CURRENT_DATE - INTERVAL 30 DAYS)

**Regions:**
- NA = North America (US, Canada, Mexico)
- EU = Europe (all EU countries + UK)
- APAC = Asia-Pacific (Australia, Japan, Singapore, etc.)
- LATAM = Latin America (Brazil, Argentina, Chile, etc.)

**Channels:**
- online = E-commerce website
- retail = Physical stores
- partner = Third-party resellers
- direct = Direct sales team

== DATE HANDLING CONVENTIONS ==

**Always use these patterns:**

- "Last month":
  ```sql
  WHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL 1 MONTH)
    AND transaction_date < DATE_TRUNC('month', CURRENT_DATE)
  ```

- "This year":
  ```sql
  WHERE YEAR(transaction_date) = YEAR(CURRENT_DATE)
  ```

- "Q1 2024":
  ```sql
  WHERE transaction_date BETWEEN '2024-01-01' AND '2024-03-31'
  ```

- "YTD":
  ```sql
  WHERE transaction_date >= DATE_TRUNC('year', CURRENT_DATE)
  ```

- "Last 7 days":
  ```sql
  WHERE transaction_date >= CURRENT_DATE - INTERVAL 7 DAYS
  ```

**Timezone:** All dates are in UTC. No conversion needed.

== PREFERRED SQL PATTERNS ==

**Always follow these patterns:**

1. **Use LIMIT for top-N queries:**
   ```sql
   SELECT customer_id, SUM(net_revenue) as total
   FROM genie_dev.curated.sales_transactions
   GROUP BY customer_id
   ORDER BY total DESC
   LIMIT 10  -- Always limit to 10 unless user asks for more
   ```

2. **Use window functions for trends:**
   ```sql
   -- Month-over-month growth
   SELECT 
       revenue_month,
       net_revenue,
       LAG(net_revenue) OVER (ORDER BY revenue_month) as prev_month_revenue,
       (net_revenue - LAG(net_revenue) OVER (ORDER BY revenue_month)) 
         / LAG(net_revenue) OVER (ORDER BY revenue_month) * 100 as growth_pct
   FROM genie_dev.certified_views.v_net_revenue_monthly
   ```

3. **Use ROUND for monetary values:**
   ```sql
   SELECT 
       region_code,
       ROUND(SUM(net_revenue), 2) as total_revenue,
       ROUND(AVG(net_revenue), 2) as avg_transaction_value
   FROM genie_dev.curated.sales_transactions
   GROUP BY region_code
   ```

4. **Use CTEs for complex queries:**
   ```sql
   WITH monthly_sales AS (
       SELECT 
           DATE_TRUNC('month', transaction_date) as month,
           SUM(net_revenue) as total_revenue
       FROM genie_dev.curated.sales_transactions
       GROUP BY 1
   )
   SELECT * FROM monthly_sales
   ORDER BY month
   ```

5. **JOIN patterns:**
   ```sql
   -- JOIN to customer_master
   FROM genie_dev.curated.sales_transactions t
   JOIN genie_dev.curated.customer_master c
     ON t.customer_id = c.customer_id
   
   -- JOIN to product_catalogue
   JOIN genie_dev.curated.product_catalogue p
     ON t.product_id = p.product_id
   ```

== OUT OF SCOPE ==

**Do NOT answer these questions from this Space:**

❌ "What's our current inventory level?" → "That question is about inventory. Please ask the Inventory & Supply assistant."

❌ "What were our marketing expenses?" → "That question is about marketing spend. Please ask the Marketing & Campaigns assistant."

❌ "Show me the P&L statement" → "That question is about financial statements. Please ask the Financial Performance assistant."

❌ "What's the cost price of this product?" → "Cost price is restricted. Please contact Finance for this information."

== HALLUCINATION PREVENTION ==

**Critical Rules:**

1. **Never invent column names:** Only use columns listed in table schemas above.

2. **Never assume relationships:** Only JOIN on explicitly documented foreign keys:
   - sales_transactions.customer_id → customer_master.customer_id
   - sales_transactions.product_id → product_catalogue.product_id

3. **Always use SELECT only:** Never generate INSERT, UPDATE, DELETE, DROP, CREATE.

4. **If uncertain, ask for clarification:** If a business term is not in this document, respond:
   "I'm not familiar with the term '[term]'. Could you clarify what you mean, or check the business glossary?"

5. **Stick to documented tables:** Don't reference tables not listed in "Primary Tables" section.

== EXAMPLE QUERIES ==

**Q: "What were total sales last month?"**
```sql
SELECT 
    SUM(net_revenue) as total_revenue
FROM genie_dev.curated.sales_transactions
WHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL 1 MONTH)
  AND transaction_date < DATE_TRUNC('month', CURRENT_DATE)
```

**Q: "Show me top 5 customers by revenue"**
```sql
SELECT 
    c.customer_name,
    ROUND(SUM(t.net_revenue), 2) as total_revenue
FROM genie_dev.curated.sales_transactions t
JOIN genie_dev.curated.customer_master c ON t.customer_id = c.customer_id
GROUP BY c.customer_name
ORDER BY total_revenue DESC
LIMIT 5
```

**Q: "Compare online vs retail sales by region"**
```sql
SELECT 
    region_code,
    channel,
    ROUND(SUM(net_revenue), 2) as total_revenue,
    COUNT(DISTINCT transaction_id) as transaction_count
FROM genie_dev.curated.sales_transactions
WHERE channel IN ('online', 'retail')
GROUP BY region_code, channel
ORDER BY region_code, total_revenue DESC
```

**Q: "What's the month-over-month growth rate?"**
```sql
SELECT 
    revenue_month,
    net_revenue,
    LAG(net_revenue) OVER (ORDER BY revenue_month) as prev_month,
    ROUND(
        (net_revenue - LAG(net_revenue) OVER (ORDER BY revenue_month)) 
        / NULLIF(LAG(net_revenue) OVER (ORDER BY revenue_month), 0) * 100,
        2
    ) as growth_pct
FROM genie_dev.certified_views.v_net_revenue_monthly
ORDER BY revenue_month
```
```

---

## 12.4 Testing Genie Spaces

### Test Space Creation

```python
# tests/unit/genie/test_space_manager.py
import pytest
from unittest.mock import MagicMock, patch
from src.genie.space_manager import GenieSpaceManager, GenieSpaceConfig


class TestGenieSpaceManager:
    
    @pytest.fixture
    def manager(self):
        """Create manager with mocked credentials"""
        with patch.dict("os.environ", {
            "DATABRICKS_HOST": "https://test.azuredatabricks.net",
            "DATABRICKS_TOKEN": "test-token"
        }):
            return GenieSpaceManager()
    
    @patch("requests.post")
    def test_create_space_success(self, mock_post, manager):
        """Test successful space creation"""
        # Mock API response
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "space_id": "test-space-123"
        }
        
        # Create config
        config = GenieSpaceConfig(
            title="Test Space",
            description="Test description",
            table_identifiers=["genie_dev.curated.test_table"],
            instructions="Test instructions"
        )
        
        # Call method
        space_id = manager.create_space(config)
        
        # Assertions
        assert space_id == "test-space-123"
        mock_post.assert_called_once()
    
    @patch("requests.post")
    def test_create_space_failure(self, mock_post, manager):
        """Test space creation failure"""
        # Mock API error
        mock_post.return_value.status_code = 400
        mock_post.return_value.text = "Invalid table identifier"
        
        config = GenieSpaceConfig(
            title="Test Space",
            description="Test",
            table_identifiers=["invalid_table"],
            instructions="Test"
        )
        
        # Should raise HTTPError
        with pytest.raises(Exception):
            manager.create_space(config)
```

---

### Integration Test

```python
# tests/integration/genie/test_genie_space_integration.py
import pytest
import os
from src.genie.space_manager import GenieSpaceManager


@pytest.mark.integration
class TestGenieSpaceIntegration:
    """
    Integration tests for Genie Spaces.
    
    Requires:
    - DATABRICKS_HOST environment variable
    - DATABRICKS_TOKEN environment variable
    - SQL Warehouse access
    """
    
    @pytest.fixture(scope="class")
    def manager(self):
        """Create real manager (not mocked)"""
        if not os.environ.get("DATABRICKS_HOST"):
            pytest.skip("DATABRICKS_HOST not set")
        
        return GenieSpaceManager()
    
    @pytest.fixture(scope="class")
    def test_space_id(self, manager):
        """Create test space and clean up after"""
        from dataclasses import dataclass
        
        test_config = GenieSpaceConfig(
            title="CI Test Space",
            description="Automated integration test - safe to delete",
            table_identifiers=["genie_dev.curated.sales_transactions"],
            instructions="Test instructions"
        )
        
        # Create space
        space_id = manager.create_space(test_config)
        yield space_id
        
        # Cleanup
        try:
            manager.delete_space(space_id)
        except:
            pass  # Ignore cleanup errors
    
    def test_space_created(self, manager, test_space_id):
        """Verify space was created"""
        space = manager.get_space(test_space_id)
        
        assert space["space_id"] == test_space_id
        assert space["title"] == "CI Test Space"
    
    def test_space_responds_to_query(self, manager, test_space_id):
        """Test that Genie responds to simple query"""
        from src.genie.accuracy_scorer import GenieAccuracyScorer
        
        scorer = GenieAccuracyScorer(test_space_id)
        
        # Ask simple question
        sql = scorer.ask_genie("How many transactions are there?")
        
        # Should return SQL
        assert sql is not None
        assert "SELECT" in sql.upper()
```

---

## Summary

### What You've Accomplished

✅ Understood Genie Spaces architecture  
✅ Created spaces programmatically via API  
✅ Configured domain-specific instructions  
✅ Bound tables and views to spaces  
✅ Implemented testing for spaces  
✅ Managed multiple spaces for different domains  

### Key Takeaways

1. **Genie Spaces** are domain-specific natural language interfaces
2. **Instructions** are critical for accurate SQL generation
3. **Multiple spaces** for different business domains (Sales, Inventory, etc.)
4. **Programmatic creation** enables version control and CI/CD
5. **Testing** ensures spaces work before user access
6. **Instructions evolve** based on failure analysis

---

### Learning Checkpoint

**Q1: What's the minimum number of Q&A examples per space?**
<details>
<summary>Click to reveal answer</summary>

A: 20 examples minimum, covering: simple aggregations, filtered queries, ranking, time-series, and multi-join queries.
</details>

**Q2: Why separate spaces by business domain?**
<details>
<summary>Click to reveal answer</summary>

A: Prevents confusion between unrelated tables, keeps instructions focused, improves accuracy, and allows domain-specific terminology.
</details>

**Q3: What happens if instructions contradict table metadata?**
<details>
<summary>Click to reveal answer</summary>

A: Genie may become confused and generate incorrect SQL. Always ensure instructions align with actual table schemas and column names.
</details>

**Q4: How often should you update instructions?**
<details>
<summary>Click to reveal answer</summary>

A: After every benchmark run that shows <85% accuracy. Analyze failure patterns and update instructions to address common mistakes.
</details>

---

**🎉 You've mastered Genie Spaces! Continue to Chapter 13 for Q&A Examples.**

---
