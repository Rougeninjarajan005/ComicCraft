import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL = "gemini-3.5-flash-lite"


def generate_outline(prompt, character, setting, tone, style):
    full_prompt = f"""
Create a 5 panel comic outline.

Character: {character}
Setting: {setting}
Tone: {tone}
Style: {style}
Story: {prompt}

Return ONLY a JSON list.

Each panel must contain:
- panel_number
- title
- description
- image_prompt
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=full_prompt,
        config={
            "response_mime_type": "application/json"
        }
    )

    try:
        return json.loads(response.text)
    except Exception:
        return [
            {
                "panel_number": i + 1,
                "title": f"Panel {i + 1}",
                "description": response.text,
                "image_prompt": prompt
            }
            for i in range(5)
        ]