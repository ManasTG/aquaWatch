from transformers import pipeline

classifier = pipeline(
    "zero-shot-image-classification",
    model="openai/clip-vit-base-patch32"
)

results = classifier(
    "sample_river.jpg",
    candidate_labels=[
        "plastic waste floating in water",
        "litter on a riverbank",
        "oil-like film on water",
        "clean water with no visible litter",
        "an unclear photograph of water"
    ]
)

for result in results:
    print(result["label"], result["score"])
