from fastapi import FastAPI

app = FastAPI(title="PM Bot Agent Service")

@app.get('/health')
def health_check():
    return {
        "status": "ok",
        "service": "agent_services",
        "version": "1.0.0"
    }