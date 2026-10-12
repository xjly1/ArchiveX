import db from "../db/database.js";

async function verifyResult(reviewId) {
    if (!reviewId) {
        throw new Error(
            "Review ID is missing."
        );
    }

    const result = await db.query(
        `
        SELECT
            id,
            octet_length(image_data) AS image_size,
            extracted_text
        FROM review
        WHERE id = $1
        `,
        [reviewId]
    );

    if (result.rowCount !== 1) {
        throw new Error(
            "Saved review record was not found."
        );
    }

    const review = result.rows[0];

    if (
        review.image_size === null ||
        review.image_size <= 0
    ) {
        throw new Error(
            "Saved image data is missing."
        );
    }

    if (
        typeof review.extracted_text !== "string"
    ) {
        throw new Error(
            "Saved extracted text is missing."
        );
    }

    return true;
}

export default verifyResult;