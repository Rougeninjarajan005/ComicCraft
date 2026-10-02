def build_comic_layout(outline, story, images):
    layout = []

    for i, panel in enumerate(outline):
        layout.append({
            "panel_number": panel["panel_number"],
            "title": panel["title"],
            "description": panel["description"],
            "image": images[i],
            "story": story
        })

    return layout