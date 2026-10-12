import fs from "fs/promises";
import sharp from "sharp";
import db from "../db/database.js";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function saveResult(
    process,
    extractedText
) {
    if (!process?.imagePath) {
        throw new Error(
            "Process image path is missing."
        );
    }

    if (
        typeof extractedText !== "string"
    ) {
        throw new Error(
            "Extracted text is invalid."
        );
    }

    const imageInfo = await fs.stat(
        process.imagePath
    );

    if (!imageInfo.isFile()) {
        throw new Error(
            "Original image was not found."
        );
    }

    let imageBuffer;

    if (
        imageInfo.size <= MAX_IMAGE_SIZE
    ) {
        imageBuffer = await fs.readFile(
            process.imagePath
        );

    } else {
        imageBuffer = await sharp(
            process.imagePath
        )
            .webp({
                quality: 85
            })
            .toBuffer();
    }

    if (
        !imageBuffer ||
        imageBuffer.length === 0
    ) {
        throw new Error(
            "Image data is empty."
        );
    }

    const result = await db.query(
        `
        INSERT INTO review (
            image_data,
            extracted_text
        )
        VALUES (
            $1,
            $2
        )
        RETURNING id
        `,
        [
            imageBuffer,
            extractedText
        ]
    );

    if (
        result.rowCount !== 1
    ) {
        throw new Error(
            "Image and text were not saved correctly."
        );
    }

    return {
        reviewId: result.rows[0].id,
        processId: process.id
    };
}

export default saveResult;