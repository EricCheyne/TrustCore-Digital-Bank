from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class Transaction(BaseModel):
    fromAccountNumber: str
    toAccountNumber: str
    amount: float
    description: str

@app.post("/api/ai/risk-score")
def calculate_risk(transaction: Transaction):
    # Simulated AI logic
    risk_score = 0.1
    
    # High amount = higher risk
    if transaction.amount > 10000:
        risk_score += 0.4
    
    # Suspicious keywords
    suspicious_keywords = ["crypto", "mixer", "offshore", "gambling"]
    if any(keyword in transaction.description.lower() for keyword in suspicious_keywords):
        risk_score += 0.3
        
    # Add a bit of randomness
    risk_score += random.uniform(0, 0.2)
    
    return {
        "risk_score": round(min(risk_score, 1.0), 2),
        "is_fraud": risk_score > 0.7,
        "recommendation": "BLOCK" if risk_score > 0.7 else "ALLOW"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-engine"}

@app.get("/")
def read_root():
    return {"message": "TrustCore AI Engine is running."}
