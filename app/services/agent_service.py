URGENCY_WORDS = [
    "urgent", "asap", "deadline", "important", "immediately", "critical",
    "action required", "time sensitive", "respond", "response needed",
    "expires", "expiring", "due", "overdue", "alert", "warning", "notice"
]

DEFAULT_KEYWORDS = [
    "meeting", "invoice", "payment", "interview", "offer", "contract",
    "review", "approval", "follow up", "response needed", "hiring",
    "job", "statement", "account", "credit", "bill", "security",
    "sign-in", "certification", "opportunity", "application", "schedule",
    "confirm", "verification", "alert", "notification", "balance"
]

FLAGGING_THRESHOLD = 5.0

def score_email(email: dict, keywords: list = None):
    if keywords is None:
        keywords = DEFAULT_KEYWORDS
    
    score = 0.0
    subject = email.get("subject", "").lower()
    body = email.get("body", "").lower()
    
    for keyword in keywords:
        if keyword.lower() in subject:
            score += 5.0
    
    for keyword in keywords:
        if keyword.lower() in body:
            score += 3.0
    
    for word in URGENCY_WORDS:
        if word in subject:
            score += 7.0
        if word in body:
            score += 4.0
    
    return round(score, 2)

def flag_email(email: dict, keywords: list = None):
    score = score_email(email, keywords)
    return {
        **email,
        "importance_score": score,
        "is_flagged": score >= FLAGGING_THRESHOLD
    }

def analyze_emails(emails: list, keywords: list = None):
    analyzed = []
    for email in emails:
        result = flag_email(email, keywords)
        analyzed.append(result)
    
    analyzed.sort(key=lambda x: x["importance_score"], reverse=True)
    return analyzed