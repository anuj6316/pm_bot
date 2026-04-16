# Phase 04 Research: Feedback Loop (UX & Dashboard)

## Executive Summary
This research defines the implementation strategy for the PM Bot dashboard and the Plane integration feedback loop. It prioritizes the "Apple" aesthetic using modern web technologies and lightweight real-time communication.

## Standard Stack
- **Frontend Framework:** React (Vite) with Tailwind CSS.
- **UI Library:** `shadcn/ui` (for accessible, unstyled components).
- **Icons:** `Lucide React` (Apple-like minimal icons).
- **Real-time:** Server-Sent Events (SSE) using Django `StreamingHttpResponse`.
- **State Management:** `TanStack Query` (for data fetching) and standard React context for UI state.

## Architecture Patterns

### 1. Real-time Status Stream (Django -> Dashboard)
To provide real-time feedback on Agent reasoning without the complexity of WebSockets:
- **Producer:** LangGraph nodes publish progress messages to a Redis channel (Pub/Sub).
- **Consumer:** A Django async view subscribes to the Redis channel and streams messages to the client using `StreamingHttpResponse` (SSE).
- **Client:** Uses `EventSource` to listen for updates and update the UI state.

### 2. Idempotent Plane Comments
To satisfy REQ-003 without duplicate spam:
- **Pattern:** Each `AgentIssueSession` tracks its `comment_id`.
- **Bot Signature:** Every comment includes a hidden HTML tag: `<!-- pm-bot: {session_id} -->`.
- **Logic:** Before posting, the bot checks for existing comments with its signature. If found, it *edits* the comment instead of creating a new one.

## Don't Hand-Roll
- **Glassmorphism:** Use Tailwind's `backdrop-blur` and `bg-opacity` utilities. Do not write custom CSS filters.
- **SSE Client:** Use the native browser `EventSource` API.
- **Component Design:** Use `shadcn/ui`'s `Card` and `Table` components as the base.

## Common Pitfalls
- **Rate Limits:** Plane API is limited to 60 req/min. Dashboard polling must be infrequent (e.g., 30s) or rely on SSE for live updates.
- **Connection Leaks:** SSE connections must be properly closed on the server side when the client disconnects to prevent exhausting Django worker threads.
- **Browser Compatibility:** `backdrop-filter` requires a fallback background color for older browsers (though minimal for this project's target).

## Code Examples

### 1. Glassmorphic Card (Tailwind/React)
```tsx
const GlassCard = ({ children }) => (
  <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-[22px] shadow-sm p-6 overflow-hidden">
    {children}
  </div>
);
```

### 2. Django SSE View (Simplified)
```python
import redis
from django.http import StreamingHttpResponse

def stream_agent_status(request, session_id):
    def event_stream():
        r = redis.Redis(host='localhost', port=6373, db=0)
        pubsub = r.pubsub()
        pubsub.subscribe(f"agent_status_{session_id}")
        
        for message in pubsub.listen():
            if message['type'] == 'message':
                yield f"data: {message['data'].decode('utf-8')}\n\n"
    
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')
```

### 3. Plane Feedback (REQ-003)
```python
def update_issue_comment(self, issue_id, session_id, content):
    signature = f"<!-- pm-bot: {session_id} -->"
    full_body = f"{content}\n\n{signature}"
    
    # Logic: Search for comment with signature, then patch or post.
    existing_comment = self.find_comment_by_signature(issue_id, signature)
    if existing_comment:
        return self.patch_comment(issue_id, existing_comment['id'], full_body)
    return self.post_comment(issue_id, full_body)
```

## Confidence Assessment
- **Glassmorphism:** 100% (Industry standard Tailwind pattern).
- **SSE Pattern:** 90% (Depends on ASGI/WSGI server configuration).
- **Plane API:** 85% (Based on standard REST patterns; rate limit specifics may vary by instance).
