from fpdf import FPDF
import os
import time

def clean_text(text):
    replacements = {
        "\u2019": "'", "\u2018": "'",
        "\u201c": '"', "\u201d": '"',
        "\u2013": "-", "\u2014": "-",
        "\u2026": "...",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text.encode("latin-1", "replace").decode("latin-1")

def save_pdf(layout):
    pdf = FPDF()

    for panel in layout:
        pdf.add_page()

        pdf.set_font("Arial", size=12)

        pdf.cell(200, 10, txt=panel["title"], ln=True)

        img_path = "app" + panel["image"]
        pdf.image(img_path, w=100)

        pdf.multi_cell(0, 10, panel["description"])

    filename = f"comic_{int(time.time())}.pdf"
    path = f"app/static/exports/{filename}"

    pdf.output(path)

    return f"/static/exports/{filename}"