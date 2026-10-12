import createProcess from "./process.js";
import regularWorkflow from "./regular.js";
import saveResult from "./save.js";
import verifyResult from "./verify.js";
import cleanupProcess from "./cleanup.js";

const conditionBox = {
    rotate: rotateWorkflow
};

async function uploadWorkflow(
    file,
    language,
    condition = null
) {
    const process =
        await createProcess(file);

    if (condition) {
        const selectedWorkflow =
            conditionBox[condition];

        if (!selectedWorkflow) {
            throw new Error(
                `Unknown condition: ${condition}`
            );
        }

        await selectedWorkflow(
            process,
            language
        );

        return;
    }

    const extractedText =
        await regularWorkflow(
            process,
            language
        );

    const result =
        await saveResult(
            process,
            extractedText
        );

    await verifyResult(
        result.reviewId
    );

    await cleanupProcess(
        process
    );

    return {
        processId: process.id,
        reviewId: result.reviewId,
        extractedText
    };
}

export default uploadWorkflow;