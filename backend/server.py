from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

app = FastAPI()
api_router = APIRouter(prefix="/api")


# =========================
# System prompt for chatbot
# =========================
SYSTEM_PROMPT = """You are Nova, the AI assistant for BVM Consultancy Services (BVMCS) — a software development consultancy that builds world-class digital products.

About BVMCS:
- We design and develop custom applications tailored to client needs and objectives.
- Services: UI/UX Design, Frontend, Mobile (Android, iOS), Backend (Ruby on Rails experts), Cloud, Architectural, Testing/QA, E-Commerce, Staffing Services, Design.
- Technologies: Ruby on Rails, Angular, Backbone JS, Node.js, Java, PostgreSQL, MySQL, MS SQL, MongoDB, Couchbase, Redis, Redshift, Nginx, HaProxy, AWS, Heroku. QA tools: Selenium, Mocha, Chai, Cypress. Design: Photoshop, XD, Illustrator, Sketch.
- Clients include MasterGST and 20+ enterprises.

Your role:
1. Answer questions concisely (2-4 sentences) about BVMCS services, technologies, process, and how we can help with the visitor's project.
2. Be friendly, sharp, and AI-native in tone — confident and helpful, never salesy.
3. If the visitor shows buying intent (asks about pricing, timelines, "how do we start", wants a quote, or describes a project), gently encourage them to share their name and email so the BVMCS team can reach out. Phrase it as: "Want our team to reach out? Just drop your name and email — I'll make sure they get back within 24 hours."
4. If the visitor provides a name and email in chat, acknowledge it warmly and confirm the team will reach out.
5. Never invent prices or specific timelines — defer to the human team for that.
6. Keep responses crisp. Use line breaks for readability. Never use markdown headers."""


# =========================
# Models
# =========================
class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str


class ChatMessageDoc(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # "user" | "assistant"
    content: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    email: EmailStr
    source: str = "chatbot"  # chatbot | contact_form
    company: Optional[str] = None
    phone: Optional[str] = None
    message: Optional[str] = None


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    source: str
    company: Optional[str] = None
    phone: Optional[str] = None
    message: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# =========================
# Routes
# =========================
@api_router.get("/")
async def root():
    return {"message": "BVMCS API live", "status": "ok"}


@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    session_id = req.session_id or str(uuid.uuid4())

    # Persist user message
    user_doc = ChatMessageDoc(session_id=session_id, role="user", content=req.message)
    await db.chat_messages.insert_one(user_doc.model_dump())

    # Build chat with rehydrated history. emergentintegrations stores history
    # via session_id internally per-instance, so we recreate the instance per
    # request and rely on the library's automatic history management for the
    # current call only. To preserve multi-turn context across requests we
    # prepend prior turns into the system message context.
    history = (
        await db.chat_messages.find({"session_id": session_id}, {"_id": 0})
        .sort("created_at", 1)
        .to_list(50)
    )
    # last 20 turns max
    history = history[-20:]
    transcript_lines = []
    for m in history[:-1]:  # exclude the just-inserted user msg
        prefix = "Visitor" if m["role"] == "user" else "Nova"
        transcript_lines.append(f"{prefix}: {m['content']}")
    transcript = "\n".join(transcript_lines)

    system_msg = SYSTEM_PROMPT
    if transcript:
        system_msg = f"{SYSTEM_PROMPT}\n\nConversation so far:\n{transcript}"

    llm = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system_msg,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        reply = await llm.send_message(UserMessage(text=req.message))
        reply_text = reply if isinstance(reply, str) else str(reply)
    except Exception as e:
        logging.exception("LLM error")
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")

    assistant_doc = ChatMessageDoc(
        session_id=session_id, role="assistant", content=reply_text
    )
    await db.chat_messages.insert_one(assistant_doc.model_dump())

    return ChatResponse(session_id=session_id, reply=reply_text)


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Lead(**d) for d in docs]


@api_router.post("/contact", response_model=Lead)
async def contact_submit(payload: LeadCreate):
    payload_dict = payload.model_dump()
    payload_dict["source"] = "contact_form"
    lead = Lead(**payload_dict)
    await db.leads.insert_one(lead.model_dump())
    return lead


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
