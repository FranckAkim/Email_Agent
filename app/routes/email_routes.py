from fastapi import APIRouter, HTTPException
from app.services.gmail_service import fetch_emails
from app.services.agent_service import analyze_emails
from app.services.draft_service import generate_drafts_for_flagged

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
    