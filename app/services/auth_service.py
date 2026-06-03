import os
import requests
from dotenv import load_dotenv
from urllib.parse import urlencode

load_dotenv()

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send"

def get_authorization_url():
    params = {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "response_type": "code",
        "scope": SCOPES,
        "access_type": "offline",
        "prompt": "consent"
    }
    auth_url = "https://accounts.google.com/o/oauth2/auth?" + urlencode(params)
    state = "static_state"
    return auth_url, state

def exchange_code_for_token(code: str, state: str):
    response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
            "grant_type": "authorization_code"
        }
    )
    token_data = response.json()
    if "error" in token_data:
        raise Exception(f"Token error: {token_data}")
    return token_data