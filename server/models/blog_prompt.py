from pydantic import BaseModel

class BlogPrompt(BaseModel):
    topic: str
    category: str
    tone: str
