
from pathlib import Path
import contextlib
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = PROJECT_ROOT / "ocr" / "ar" / "engine"
CONFIG_PATH = PROJECT_ROOT / "config.json"

PROMPT = "Extract all text from this image exactly as written."

MIN_PIXELS = 256 * 28 * 28
MAX_PIXELS = 1280 * 28 * 28


def get_device() -> str:
    with CONFIG_PATH.open("r", encoding="utf-8") as file:
        config = json.load(file)

    cuda = config.get("cuda")

    if cuda not in ("cpu", "gpu"):
        raise ValueError(
            "Invalid 'cuda' value in config.json. Expected 'cpu' or 'gpu'."
        )

    return "cuda" if cuda == "gpu" else "cpu"


def main() -> None:
    if len(sys.argv) != 2:
        raise ValueError(
            "Usage: python ocr.py <image_path>"
        )

    image_path = Path(sys.argv[1]).resolve()

    if not image_path.is_file():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    device = get_device()

    with contextlib.redirect_stdout(sys.stderr):
        import torch
        from PIL import Image
        from qwen_vl_utils import process_vision_info
        from transformers import (
            AutoProcessor,
            Qwen2VLForConditionalGeneration,
        )

        model = Qwen2VLForConditionalGeneration.from_pretrained(
            MODEL_DIR,
            torch_dtype=torch.float32,
        )

        model = model.to(device)
        model.eval()

        processor = AutoProcessor.from_pretrained(
            MODEL_DIR,
            min_pixels=MIN_PIXELS,
            max_pixels=MAX_PIXELS,
        )

        image = Image.open(
            image_path
        ).convert("RGB")

        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "image": image,
                    },
                    {
                        "type": "text",
                        "text": PROMPT,
                    },
                ],
            }
        ]

        text = processor.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        image_inputs, _ = process_vision_info(
            messages
        )

        inputs = processor(
            text=[text],
            images=image_inputs,
            padding=True,
            return_tensors="pt",
        ).to(device)

        with torch.inference_mode():
            generated_ids = model.generate(
                **inputs,
                max_new_tokens=2048,
            )

        generated_ids_trimmed = [
            output_ids[len(input_ids):]
            for input_ids, output_ids in zip(
                inputs.input_ids,
                generated_ids,
            )
        ]

        result = processor.batch_decode(
            generated_ids_trimmed,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=False,
        )[0]

    print(result)


if __name__ == "__main__":
    main()