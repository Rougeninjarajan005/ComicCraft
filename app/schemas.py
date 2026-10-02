from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str
    character: str
    setting: str
    tone: str
    style: str