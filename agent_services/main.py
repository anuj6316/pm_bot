from fastapi import FastAPI

app = FastAPI(title = "FastAPI PM Bot")

@app.get("/health")
def health_check():
    return {
        "msg": "fastapi server is running",
        "status_code": 200
    }