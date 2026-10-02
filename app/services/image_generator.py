import os
import uuid
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

client = InferenceClient(
    provider="auto",
    api_key=HF_TOKEN
)

MODEL = "black-forest-labs/FLUX.1-schnell"


def generate_image(prompt):
    image = client.text_to_image(
        prompt,
        model=MODEL
    )

    filename = f"{uuid.uuid4().hex}.png"
    path = f"app/static/panels/{filename}"

    image.save(path)

    return f"/static/panels/{filename}"