from functools import lru_cache
from pathlib import Path

from transformers import pipeline

MODEL_ID = "openai/clip-vit-base-patch32"

CANDIDATE_LABELS = [
    "plastic waste floating in water",
    "litter scattered on a riverbank",
    "an oil-like film on the surface of water",
    "clean water with no obvious visible litter",
    "an unclear photograph of water",
]


@lru_cache(maxsize=1)
def get_classifier():
    return pipeline(
        "zero-shot-image-classification",
        model=MODEL_ID,
    )


def analyze_image(image_path: str) -> dict:
    path = Path(image_path)

    if not path.is_file():
        raise FileNotFoundError("Image file not found")

    classifier = get_classifier()
    predictions = classifier(
        str(path),
        candidate_labels=CANDIDATE_LABELS,
    )

    top = predictions[0]

    return {
        "category": top["label"],
        "similarity_score": float(top["score"]),
        "predictions": [
            {
                "label": item["label"],
                "score": float(item["score"]),
            }
            for item in predictions
        ],
        "model": MODEL_ID,
    }
