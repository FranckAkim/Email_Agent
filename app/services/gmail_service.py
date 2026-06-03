import os
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

def get_headers(access_token: str):
    return {"Authorization": f"Bearer {access_token}"}

def fetch_email_list(access_token: str, max_results: int = 10):
    url = "https://gmail.googleapis.com/gmail/v1/users/me/messages"
    params = {
        "maxResults": max_results,
        "q": "is:unread"
    }
    response = requests.get(url, headers=get_headers(access_token), params=params)
    data = response.json()
    
    if "error" in data:
        raise Exception(f"Gmail API error: {data['error']}")
    
    return data.get("messages", [])

def fetch_email_content(access_token: str, message_id: str):
    url = f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{message_id}"
    response = requests.get(url, headers=get_headers(access_token))
    data = response.json()
    
    if "error" in data:
        raise Exception(f"Gmail API error: {data['error']}")
    
    headers = data.get("payload", {}).get("headers", [])
    subject = next((h["value"] for h in headers if h["name"] == "Subject"), "No Subject")
    sender = next((h["value"] for h in headers if h["name"] == "From"), "Unknown")
    
    body = ""
    payload = data.get("payload", {})
    
    if "parts" in payload:
        for part in payload["parts"]:
            if part["mimeType"] == "text/plain":
                body_data = part.get("body", {}).get("data", "")
                if body_data:
                    body = base64.urlsafe_b64decode(body_data).decode("utf-8")
                    break
    elif "body" in payload:
        body_data = payload["body"].get("data", "")
        if body_data:
            body = base64.urlsafe_b64decode(body_data).decode("utf-8")
    
    return {
        "gmail_id": message_id,
        "sender": sender,
        "subject": subject,
        "body": body[:500]
    }

def fetch_emails(access_token: str, max_results: int = 10):
    messages = fetch_email_list(access_token, max_results)
    emails = []
    for msg in messages:
        email = fetch_email_content(access_token, msg["id"])
        emails.append(email)
    return emails
