from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    gmail_token = Column(Text, nullable=True)
    keywords = Column(Text, default="urgent,important,asap,deadline")
    importance_threshold = Column(Float, default=5.0)
    emails = relationship("Email", back_populates="user")

class Email(Base):
    __tablename__ = "emails"
    id = Column(Integer, primary_key=True, index=True)
    gmail_id = Column(String, unique=True)
    sender = Column(String)
    subject = Column(String)
    body = Column(Text)
    received_at = Column(DateTime, default=datetime.utcnow)
    importance_score = Column(Float, default=0.0)
    is_flagged = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="emails")
    draft = relationship("Draft", back_populates="email", uselist=False)

class Draft(Base):
    __tablename__ = "drafts"
    id = Column(Integer, primary_key=True, index=True)
    email_id = Column(Integer, ForeignKey("emails.id"))
    draft_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")
    email = relationship("Email", back_populates="draft")

