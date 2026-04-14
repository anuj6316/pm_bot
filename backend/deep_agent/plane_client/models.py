## 1. Imports
from __future__ import annotations

from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, Field

class IssuePriority(str, Enum):
    URGENT = "urgent"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    NONE = "none"

# class IssueState(str, Enum):
#     OPEN = "open"
#     IN_PROGRESS = "in_progress"
#     CLOSED = "closed"
#     ON_HOLD = "on_hold"
#     CANCELLED = "cancelled"

# class IssueType(str, Enum):
#     BUG = "bug"
#     FEATURE = "feature"
#     TASK = "task"
#     EPIC = "epic"
#     STORY = "story"

# class IssueLabel(str, Enum):
#     BUG = "bug"
#     FEATURE = "feature"
#     TASK = "task"
#     EPIC = "epic"
#     STORY = "story"

# class IssueLabel(str, Enum):
#     BUG = "bug"
#     FEATURE = "feature"
#     TASK = "task"
#     EPIC = "epic"
#     STORY = "story"

class Project(BaseModel):
    id: str
    name: str
    identifier: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    