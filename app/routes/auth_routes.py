from fastapi import APIRouter, HTTPException
from app.services.auth_service import get_authorization_url, exchange_code_for_token

router = APIRouter()

@router.get("/auth/login")
def login():
    auth_url, state = get_authorization_url()
    return {"auth_url": auth_url, "state": state}

@router.get("/auth/callback")
def callback(code: str = None, state: str = None, error: str = None):
    if error:
        raise HTTPException(status_code=400, detail=f"OAuth error: {error}")
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")
    
    token_data = exchange_code_for_token(code, state)
    return {"message": "Authentication successful", "token": token_data}

