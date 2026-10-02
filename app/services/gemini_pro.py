import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL = "gemini-3.5-flash-lite"


def generate_story(outline):
    prompt = f"""
Expand this comic outline into detailed comic narration.

Outline:
{outline}

Write clear narration for all 5 panels.
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text