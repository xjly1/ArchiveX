import { validateImage } from "./filter.js";

const imageInput = document.getElementById("imageInput");
const fileName = document.getElementById("fileName");
const startButton = document.getElementById("startButton");
const conditionsSection = document.getElementById("conditionsSection");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");
const rotatePanel = document.getElementById("rotatePanel");
const rotateAngle = document.getElementById("rotateAngle");
const status = document.getElementById("status");

const rotatePreviewImage =
    document.getElementById(
        "rotatePreviewImage"
    );

const languageInputs =
    document.querySelectorAll(
        'input[name="language"]'
    );

const languageConditions =
    document.querySelectorAll(
        ".language-conditions"
    );

const rotateInput =
    document.querySelector(
        'input[name="condition"][value="rotate"]'
    );

let selectedImage = null;
let selectedLanguage = null;
let selectedCondition = null;
let previewUrl = null;
let currentRotation = 0;
let isRotating = false;
let rotationStartAngle = 0;
let pointerStartAngle = 0;

export function getInputData() {
    return {
        image: selectedImage,
        language: selectedLanguage,
        condition: selectedCondition
    };
}

function updateStartButton() {
    startButton.disabled =
        !selectedImage ||
        !selectedLanguage ||
        !!selectedCondition;
}

function updateRotateAngle() {
    rotateAngle.textContent =
        `زاوية التدوير: ${currentRotation.toFixed(2)}°`;
}

function applyRotation() {
    rotatePreviewImage.style.transform =
        `rotate(${currentRotation}deg)`;

    updateRotateAngle();
}

function getPointerAngle(event) {
    const rect = rotatePreviewImage.getBoundingClientRect();

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;

    const deltaX = event.clientX - centerX;

    const deltaY = event.clientY - centerY;

    return Math.atan2(
        deltaY,
        deltaX
    ) * (180 / Math.PI);
}

function startRotation(event) {
    if (!rotateInput.checked) {
        return;
    }

    isRotating = true;
    pointerStartAngle = getPointerAngle(event);
    rotationStartAngle = currentRotation;

    rotatePreviewImage.setPointerCapture(
        event.pointerId
    );

    rotatePreviewImage.classList.add(
        "rotating"
    );

    event.preventDefault();
}

function rotateImage(event) {
    if (!isRotating) {
        return;
    }

    const pointerAngle = getPointerAngle(event);

    let angleDifference =
        pointerAngle -
        pointerStartAngle;

    if (angleDifference > 180) {
        angleDifference -= 360;
    }

    if (angleDifference < -180) {
        angleDifference += 360;
    }

    currentRotation =
        rotationStartAngle +
        angleDifference;

    applyRotation();
}

function stopRotation(event) {
    if (!isRotating) {
        return;
    }

    isRotating = false;

    if (
        event &&
        rotatePreviewImage.hasPointerCapture(
            event.pointerId
        )
    ) {
        rotatePreviewImage.releasePointerCapture(
            event.pointerId
        );
    }

    rotatePreviewImage.classList.remove(
        "rotating"
    );
}

function updateRotatePanel() {
    const rotateSelected = rotateInput.checked;

    if (
        rotateSelected &&
        selectedImage
    ) {
        rotatePreviewImage.src = previewUrl;
        applyRotation();
        rotatePanel.style.display = "block";

        return;
    }

    stopRotation();
    rotatePreviewImage.src = "";
    rotatePanel.style.display = "none";
}

function clearImagePreview() {
    stopRotation();

    if (previewUrl) {
        URL.revokeObjectURL(
            previewUrl
        );

        previewUrl = null;
    }

    selectedImage = null;
    previewImage.src = "";
    imagePreview.style.display = "none";
    rotatePreviewImage.src = "";
    rotatePreviewImage.style.transform = "rotate(0deg)";

    rotatePreviewImage.classList.remove(
        "rotating"
    );

    rotatePanel.style.display = "none";
    currentRotation = 0;
    updateRotateAngle();
}

imageInput.addEventListener(
    "change",
    () => {
        selectedImage = imageInput.files[0] ?? null;

        const validation =
            validateImage(
                selectedImage
            );

        if (!validation.valid) {
            selectedImage = null;
            imageInput.value = "";
            clearImagePreview();
            fileName.textContent = "اضغط لاختيار صورة";
            status.textContent = validation.error;
            updateStartButton();

            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(
                previewUrl
            );
        }

        previewUrl =
            URL.createObjectURL(
                selectedImage
            );

        currentRotation = 0;
        updateRotateAngle();
        previewImage.src = previewUrl;
        imagePreview.style.display = "block";
        updateRotatePanel();
        fileName.textContent = "تم اختيار الصورة";
        status.textContent = "";

        updateStartButton();
    }
);

languageInputs.forEach(
    (input) => {
        input.addEventListener(
            "change",
            () => {
                selectedLanguage = input.value;
                selectedCondition = null;
                conditionsSection.style.display = "block";

                languageConditions.forEach(
                    (section) => {
                        section.style.display =
                            section.dataset.language ===
                            selectedLanguage
                                ? "block"
                                : "none";
                    }
                );

                document
                    .querySelectorAll(
                        'input[name="condition"]'
                    )
                    .forEach(
                        (condition) => {
                            condition.checked = false;
                        }
                    );

                stopRotation();
                currentRotation = 0;
                rotatePreviewImage.src = "";
                rotatePreviewImage.style.transform = "rotate(0deg)";
                rotatePanel.style.display = "none";
                updateRotateAngle();
                startButton.style.display = "block";
                status.textContent = "";
                updateStartButton();
            }
        );
    }
);

rotateInput.addEventListener(
    "change",
    () => {
        selectedCondition =
            rotateInput.checked
                ? rotateInput.value
                : null;

        if (!rotateInput.checked) {
            stopRotation();
            currentRotation = 0;
            rotatePreviewImage.style.transform = "rotate(0deg)";
            updateRotateAngle();
        }

        updateRotatePanel();
        updateStartButton();
    }
);

rotatePreviewImage.addEventListener(
    "pointerdown",
    startRotation
);

rotatePreviewImage.addEventListener(
    "pointermove",
    rotateImage
);

rotatePreviewImage.addEventListener(
    "pointerup",
    stopRotation
);

rotatePreviewImage.addEventListener(
    "pointercancel",
    stopRotation
);

rotatePreviewImage.addEventListener(
    "lostpointercapture",
    stopRotation
);