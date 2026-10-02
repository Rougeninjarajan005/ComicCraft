from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.services.gemini_flash import generate_outline
from app.services.gemini_pro import generate_story
from app.services.image_generator import generate_image
from app.services.layout_builder import build_comic_layout
from app.services.exporters import save_pdf

from app.schemas import PromptRequest

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
    request=request,
    name="index.html"
)

@router.post("/generate", response_class=HTMLResponse)
def generate(request: Request,
             prompt: str = Form(...),
             character: str = Form(...),
             setting: str = Form(...),
             tone: str = Form(...),
             style: str = Form(...)):

    outline = generate_outline(prompt, character, setting, tone, style)
    story = generate_story(outline)

    images = [generate_image(p["image_prompt"]) for p in outline]

    layout = build_comic_layout(outline, story, images)

    pdf_path = save_pdf(layout)

    return templates.TemplateResponse(
    request=request,
    name="comic_preview.html",
    context={
        "layout": layout,
        "pdf": pdf_path
    }
)


@router.post("/generate-comic/json")
def generate_json(data: PromptRequest):
    outline = generate_outline(
        data.prompt, data.character, data.setting, data.tone, data.style
    )

    story = generate_story(outline)
    images = [generate_image(p["image_prompt"]) for p in outline]
    layout = build_comic_layout(outline, story, images)
    pdf = save_pdf(layout)

    return {"layout": layout, "pdf": pdf}