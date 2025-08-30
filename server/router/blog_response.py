from fastapi import APIRouter
from models.blog_prompt import BlogPrompt
from llm.llm import generate_blog
from llm.prompts import BLOG_PROMPT_TEMPLATE

router = APIRouter()

@router.post("/blog")
async def generate_blog_endpoint(prompt: BlogPrompt):
    # Pass the individual fields from the BlogPrompt object to the function
    blog_data = generate_blog(
        topic=prompt.topic,
        tone=prompt.tone,
        category=prompt.category
    )
    return {"success": True, **blog_data}
