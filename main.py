from fastapi import FastAPI
from config.database import engine, Base
import app.models.model
from app.routes.auth_routes import router as auth_router
from app.routes.email_routes import router as email_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(email_router)

@app.get("/")
def read_root():
    return {"message": "Email Agent is running"}
