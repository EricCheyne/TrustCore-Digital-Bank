from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-engine"}

@app.get("/")
def read_root():
    return {"message": "TrustCore AI Engine is running."}
