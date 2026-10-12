import sys
from pathlib import Path
import cv2

PROJECT_ROOT = Path(__file__).resolve().parents[6]
OUTPUT_DIR = (PROJECT_ROOT / "temp" / "ar_imgs" / "crops")

def detect_text_regions(
    image_path: Path
) -> None:
    image = cv2.imread(
        str(image_path)
    )

    if image is None:
        raise ValueError(
            f"Could not read image: {image_path}"
        )

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    blackhat_kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (31, 31),
    )

    blackhat = cv2.morphologyEx(
        gray,
        cv2.MORPH_BLACKHAT,
        blackhat_kernel,
    )

    _, binary = cv2.threshold(
        blackhat,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU,
    )

    connect_kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (35, 7),
    )

    connected = cv2.morphologyEx(
        binary,
        cv2.MORPH_CLOSE,
        connect_kernel,
    )

    contours, _ = cv2.findContours(
        connected,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE,
    )

    image_height, image_width = gray.shape

    regions = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(
            contour
        )

        area = w * h

        if (
            area
            < image_width
            * image_height
            * 0.001
        ):
            continue

        if w < 30 or h < 8:
            continue

        if (
            w > image_width * 0.98
            and h > image_height * 0.98
        ):
            continue

        regions.append(
            (x, y, w, h)
        )

    line_tolerance = 20

    regions.sort(
        key=lambda r: r[1]
    )

    lines = []

    for region in regions:
        x, y, w, h = region

        center_y = (
            y + h / 2
        )

        placed = False

        for line in lines:
            line_center_y = sum(
                r[1] + r[3] / 2
                for r in line
            ) / len(line)

            if (
                abs(
                    center_y
                    - line_center_y
                )
                <= line_tolerance
            ):
                line.append(
                    region
                )

                placed = True

                break

        if not placed:
            lines.append(
                [region]
            )

    ordered_regions = []

    for line in lines:
        line.sort(
            key=lambda r: r[0],
            reverse=True
        )

        ordered_regions.extend(
            line
        )

    for index, (x, y, w, h) in enumerate(
        ordered_regions,
        start=1,
    ):
        padding = 5

        x1 = max(
            0,
            x - padding
        )

        y1 = max(
            0,
            y - padding
        )

        x2 = min(
            image_width,
            x + w + padding
        )

        y2 = min(
            image_height,
            y + h + padding
        )

        crop = image[
            y1:y2,
            x1:x2
        ]

        crop_path = (
            OUTPUT_DIR
            / f"{index:03d}.png"
        )

        if not cv2.imwrite(
            str(crop_path),
            crop
        ):
            raise RuntimeError(
                f"Could not save crop: {crop_path}"
            )

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "Usage: python crop.py <image_path>"
        )

        sys.exit(1)

    detect_text_regions(
        Path(
            sys.argv[1]
        )
    )
