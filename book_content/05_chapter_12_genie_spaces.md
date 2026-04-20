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
