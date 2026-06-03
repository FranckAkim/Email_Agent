import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_draft(email: dict) -> str:
    sender = email.get("sender", "Unknown")
    subject = email.get("subject", "No Subject")
    body = email.get("body", "")

    prompt = f"""You are a professional email assistant. Draft a concise, professional response to the following email.

From: {sender}
Subject: {subject}
Body: {body}

Write only the email body response. Be professional, concise, and helpful. Do not include subject line or greeting headers."""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )

    return response.choices[0].message.content

def generate_drafts_for_flagged(emails: list) -> list:
    results = []
    for email in emails:
        if email.get("is_flagged"):
            draft_text = generate_draft(email)
            results.append({
                **email,
                "draft": draft_text,
                "draft_status": "pending"
            })
    return results
