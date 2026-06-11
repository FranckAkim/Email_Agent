This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Email Agent — AI-Powered Email Management

An agentic AI web application that reads your Gmail, scores emails by importance, generates AI draft responses using Groq (Llama 3.1), and lets you approve, edit, or dismiss drafts before sending.

---

## What This Project Does

- Connects to your Gmail account via OAuth 2.0
- Fetches your inbox emails
- Scores each email by importance using keyword and urgency matching
- Flags high-priority emails automatically
- Generates AI-powered draft responses for flagged emails using Groq
- Lets you approve, edit, or dismiss each draft
- Sends approved drafts back via Gmail on your behalf
- Automatically refreshes your access token so you stay logged in

---

## Tech Stack

**Backend**
- Python 3.12+
- FastAPI — web framework
- SQLAlchemy — database ORM
- SQLite — local database
- Google OAuth 2.0 — Gmail authentication
- Gmail API — reading and sending emails
- Groq API (Llama 3.1) — AI draft generation

**Frontend**
- Next.js 16 — React framework
- Tailwind CSS — styling

---

## Project Structure

```
Ego_AI/
├── app/
│   ├── models/
│   │   └── model.py          # Database models (User, Email, Draft)
│   ├── routes/
│   │   ├── auth_routes.py    # OAuth login, callback, token refresh
│   │   └── email_routes.py   # Fetch emails, generate drafts, send
│   └── services/
│       ├── auth_service.py   # Google OAuth logic
│       ├── gmail_service.py  # Gmail API — fetch and send emails
│       ├── agent_service.py  # Importance scoring logic
│       └── draft_service.py  # Groq AI draft generation
├── config/
│   └── database.py           # SQLAlchemy database connection
├── frontend/
│   └── app/
│       ├── page.tsx          # Login page
│       ├── callback/
│       │   └── page.tsx      # OAuth callback handler
│       ├── inbox/
│       │   └── page.tsx      # Inbox view with importance scores
│       ├── drafts/
│       │   └── page.tsx      # Drafts view with approve/edit/dismiss
│       └── utils/
│           └── api.js        # Fetch utility with auto token refresh
├── main.py                   # FastAPI app entry point
├── .env                      # Environment variables (never commit this)
└── .env.example              # Template for environment variables
```

---

## Prerequisites

Before setting up this project, make sure you have the following installed:

- Python 3.12 or higher — https://python.org
- Node.js 18 or higher — https://nodejs.org
- Git — https://git-scm.com
- A Google account with Gmail
- A Groq account (free) — https://console.groq.com

---

## Environment Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/FranckAkim/Email_Agent.git
cd Email_Agent
```

### Step 2 — Create and Activate Virtual Environment

```powershell
# Windows (PowerShell)
python -m venv venv --without-pip
venv\Scripts\activate
python -m ensurepip --upgrade
```

```bash
# Mac/Linux
python -m venv venv
source venv/bin/activate
```

### Step 3 — Install Backend Dependencies

```powershell
pip install fastapi uvicorn sqlalchemy authlib python-dotenv google-auth-oauthlib google-auth-httplib2 groq requests --target ./venv/Lib/site-packages
```

### Step 4 — Set Up Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create a new project called "Email Agent"
3. Go to APIs & Services → Library → search "Gmail API" → Enable
4. Go to APIs & Services → OAuth consent screen
   - Click Audience → Make External → Testing → Confirm
   - Add your Gmail address as a test user
5. Go to APIs & Services → Credentials → Create Credentials → OAuth Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`
   - Click Create and copy your Client ID and Client Secret

### Step 5 — Get a Groq API Key

1. Go to https://console.groq.com
2. Sign up for a free account
3. Generate an API key

### Step 6 — Create Your .env File

Create a file called `.env` in the root of the project:

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
SECRET_KEY=anyrandomstringofcharacters
GROQ_API_KEY=your_groq_api_key_here
```

### Step 7 — Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the Project

You need two terminals running at the same time.

### Terminal 1 — Start the Backend

```powershell
# From the root Ego_AI folder
venv\Scripts\activate
python -m uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### Terminal 2 — Start the Frontend

```powershell
# From the root Ego_AI folder
cd frontend
npm run dev
```

Frontend runs at: http://localhost:3000

---

## Using the App

1. Open http://localhost:3000 in your browser
2. Click "Connect Gmail"
3. Log in with your Google account and grant permissions
4. You'll be redirected to your inbox automatically
5. Emails are sorted by importance score — red border means flagged
6. Click "View Drafts" to see AI-generated responses for flagged emails
7. For each draft you can:
   - Click "Approve & Send" to send immediately
   - Click "Edit" to modify the draft before sending
   - Click "Dismiss" to remove it from the list

---

## How the Importance Scoring Works

Every email starts at a score of 0. Points are added based on:

- Keyword match in subject line: +5 points each
- Keyword match in email body: +3 points each
- Urgency word in subject (urgent, asap, deadline, etc.): +7 points each
- Urgency word in body: +4 points each

Emails scoring 5 or above are flagged and get AI drafts generated.

Default keywords include: meeting, invoice, payment, interview, offer, contract, hiring, job, statement, account, security, certification, and more.

---

## How Token Refresh Works

Google access tokens expire after 1 hour. This app handles that automatically:

1. When you first log in, both the access token and refresh token are stored in your browser's localStorage
2. When a request fails with a 401/400 error, the app automatically calls `/auth/refresh` with your refresh token
3. A new access token is issued and stored
4. The original request is retried with the new token

You should only need to log in once per session.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/auth/login` | Get Google OAuth URL |
| GET | `/auth/callback` | Handle OAuth callback |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/emails` | Fetch and score all inbox emails |
| GET | `/emails/flagged` | Fetch only flagged emails |
| GET | `/emails/drafts` | Fetch flagged emails with AI drafts |
| POST | `/emails/send` | Send an approved draft |

---

## Common Issues

**uvicorn not recognized**
Run `python -m uvicorn main:app --reload` instead of just `uvicorn`.

**Token expired (401 error)**
Click "Connect Gmail" again to get a fresh token.

**Gmail API not enabled**
Go to https://console.developers.google.com/apis/api/gmail.googleapis.com and enable it for your project.

**Only seeing 50 emails**
In `app/services/gmail_service.py`, increase `max_results` in the `fetch_emails` function.

**CORS error in browser**
Make sure your FastAPI backend is running and the CORS middleware is configured for `http://localhost:3000`.

---

## Built By

Franck N. (Dee)
Graduate Student — Computer Information Systems, PVAMU
GitHub: https://github.com/FranckAkim
