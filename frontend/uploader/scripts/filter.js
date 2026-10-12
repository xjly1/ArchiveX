const SUPPORTED_EXTENSIONS = [
    ".png", ".jpg",
    ".jpeg", ".webp",
    ".bmp", ".tif",
    ".tiff", ".jp2"
];

export function getSupportedExtensions() {
    return [
        ...SUPPORTED_EXTENSIONS
    ];
}

export function getAcceptAttribute() {
    return SUPPORTED_EXTENSIONS.join(",");
}

export function isSupportedImage(file) {
    if (!file) {
        return false;
    }

    const fileName = file.name.toLowerCase();
    const lastDotIndex = fileName.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return false;
    }

    const extension = fileName.slice(lastDotIndex);

    return SUPPORTED_EXTENSIONS.includes(
        extension
    );
}

export function validateImage(file) {
    if (!file) {
        return {
            valid: false,
            error: "لم يتم اختيار صورة."
        };

    }

    if (!isSupportedImage(file)) {
        return {
            valid: false,
            error: "امتداد الصورة غير مدعوم."
        };
    }

    return {
        valid: true,
        error: null
    };
}
