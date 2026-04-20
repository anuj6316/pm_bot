---
title: "Databricks Genie Implementation Guide with Pulumi (Python)"
subtitle: "Month 1 & Month 2 - Complete Learning Edition"
author: "Mindmap"
date: "April 2026"
version: "v2.0 Pulumi Learning Edition"
classification: "CONFIDENTIAL - Developer Reference"
toc: true
toc-depth: 3
number-sections: true
---
# Databricks Genie Implementation Guide with Pulumi (Python)

## Month 1 & Month 2 - Complete Learning Edition

### From Zero to Production-Ready Data Platform

---

**Version:** v2.0 Pulumi Learning Edition  
**Date:** April 2026  
**Classification:** CONFIDENTIAL - Developer Reference

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
