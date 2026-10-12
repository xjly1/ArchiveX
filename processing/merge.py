import sys
from pathlib import Path
import cv2
import numpy as np

PROJECT_ROOT = Path(__file__).resolve().parents[6]
CROPS_DIR = (PROJECT_ROOT / "temp" / "ar_imgs" / "crops")
OUTPUT_DIR = ( PROJECT_ROOT / "temp" / "ar_imgs" / "merge")
GAP = 30
BACKGROUND_VALUE = 255

def load_image(
    path: Path
) -> np.ndarray:
    image = cv2.imread(
        str(path)
    )

    if image is None:
        raise ValueError(
            f"Could not read image: {path}"
        )

    return image


def combine_images(
    first: np.ndarray,
    second: np.ndarray | None,
) -> np.ndarray:

    if second is None:
        return first.copy()

    first_height, first_width = (
        first.shape[:2]
    )

    second_height, second_width = (
        second.shape[:2]
    )

    width = max(
        first_width,
        second_width
    )

    height = (
        first_height
        + GAP
        + second_height
    )

    combined = np.full(
        (
            height,
            width,
            3
        ),
        BACKGROUND_VALUE,
        dtype=np.uint8,
    )

    combined[
        0:first_height,
        0:first_width,
    ] = first

    second_y = (
        first_height
        + GAP
    )

    combined[
        second_y:
        second_y + second_height,
        0:second_width,
    ] = second

    return combined


def combine_crops(
    selected_crops: list[str]
) -> None:
    if not CROPS_DIR.is_dir():
        raise FileNotFoundError(
            f"Crops directory not found: {CROPS_DIR}"
        )

    if not selected_crops:
        raise ValueError(
            "No crops selected."
        )

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    image_paths = []

    for crop_name in selected_crops:
        crop_path = (
            CROPS_DIR
            / crop_name
        )

        if not crop_path.is_file():
            raise FileNotFoundError(
                f"Crop not found: {crop_path}"
            )

        image_paths.append(
            crop_path
        )

    for index in range(
        0,
        len(image_paths),
        2
    ):
        first_path = (
            image_paths[index]
        )

        first = load_image(
            first_path
        )

        second = None
        second_path = None

        if (
            index + 1
            < len(image_paths)
        ):

            second_path = (
                image_paths[
                    index + 1
                ]
            )

            second = load_image(
                second_path
            )

        combined = combine_images(
            first,
            second,
        )

        if second_path is None:
            output_name = (
                f"{first_path.stem}.png"
            )

        else:
            output_name = (
                f"{first_path.stem}_"
                f"{second_path.stem}.png"
            )

        output_path = (
            OUTPUT_DIR
            / output_name
        )

        if not cv2.imwrite(
            str(output_path),
            combined,
        ):

            raise RuntimeError(
                f"Could not save output: {output_path}"
            )


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(
            "Usage: python merge.py "
            "<crop1> [crop2] ..."
        )

        sys.exit(1)

    combine_crops(
        sys.argv[1:]
    )
