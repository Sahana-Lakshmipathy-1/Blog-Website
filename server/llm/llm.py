import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
from llm.prompts import SYSTEM_PROMPT

load_dotenv()

# Load API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

chat_llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.7
)

def generate_blog(topic: str, tone: str, category: str):
    # Strongly enforce JSON response
    combined_prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"Generate a blog post on the topic '{topic}' in a {tone} tone, "
        f"for the category '{category}'.\n\n"
        "Respond ONLY with a valid JSON object in this exact format:\n"
        "{\n"
        '  "title": "Your blog title",\n'
        '  "subtitle": "A short subtitle",\n'
        '  "content": "The full blog content"\n'
        "}\n\n"
        "Do not include any extra text, markdown formatting, or explanations."
    )

    try:
        # Ask LLM
        response = chat_llm.invoke([HumanMessage(content=combined_prompt)])
        raw_content = response.content

        # Clean up possible formatting issues
        cleaned = (
            raw_content.strip("`")        # remove backticks
            .replace("json", "", 1)       # remove "json" prefix if present
            .strip()
        )

        # Parse JSON safely
        blog_data = json.loads(cleaned)

        return {
            "title": blog_data.get("title", ""),
            "subtitle": blog_data.get("subtitle", ""),
            "content": blog_data.get("content", "")
        }

    except json.JSONDecodeError:
        print(f"JSONDecodeError: Could not parse response:\n{response.content}")
        return {
            "title": "",
            "subtitle": "",
            "content": response.content
        }
