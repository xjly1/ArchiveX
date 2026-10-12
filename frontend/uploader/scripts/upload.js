import {
    getInputData
} from "./input.js";

import {
    uploadImage
} from "../api/upload.js";

const startButton =
    document.getElementById(
        "startButton"
    );

const status =
    document.getElementById(
        "status"
    );

startButton.addEventListener(
    "click",
    async () => {
        const {
            image,
            language,
            condition
        } = getInputData();

        if (!image || !language) {
            return;
        }

        startButton.disabled = true;

        status.textContent =
            "جاري تنفيذ العملية...";

        try {
            if (condition) {
                await uploadImage(
                    image,
                    language,
                    condition
                );
            } else {
                await uploadImage(
                    image,
                    language
                );
            }

            status.textContent =
                "تمت العملية بنجاح.";

        } catch (error) {
            status.textContent =
                error.message ||
                "حدث خطأ أثناء تنفيذ العملية.";

        } finally {
            startButton.disabled = false;
        }
    }
);