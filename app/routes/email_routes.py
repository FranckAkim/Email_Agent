from fastapi import APIRouter, HTTPException
from app.services.gmail_service import fetch_emails
from app.services.agent_service import analyze_emails
from app.services.draft_service import generate_drafts_for_flagged
from app.services.gmail_service import fetch_emails, send_email
from pydantic import BaseModel

router = APIRouter()

@router.get("/emails")
def get_emails(access_token: str):
    try:
        emails = fetch_emails(access_token)
        analyzed = analyze_emails(emails)
        return {"emails": analyzed}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/emails/flagged")
def get_flagged_emails(access_token: str):
    try:
        emails = fetch_emails(access_token)
        analyzed = analyze_emails(emails)
        flagged = [e for e in analyzed if e["is_flagged"]]
        return {"flagged_emails": flagged, "count": len(flagged)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/emails/drafts")
def get_drafts(access_token: str):
    try:
        emails = fetch_emails(access_token)
        analyzed = analyze_emails(emails)
        drafts = generate_drafts_for_flagged(analyzed)
        return {"drafts": drafts, "count": len(drafts)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class SendEmailRequest(BaseModel):
    access_token: str
    to: str
    subject: str
    body: str

@router.post("/emails/send")
def send_email_route(request: SendEmailRequest):
    try:
        result = send_email(request.access_token, request.to, request.subject, request.body)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))