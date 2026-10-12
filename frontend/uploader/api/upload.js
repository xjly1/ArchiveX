const API_URL = "http://localhost:3000/api/uploader";

export async function uploadImage(
    image,
    language,
    condition
) {
    const formData = new FormData();

    formData.append(
        "image",
        image
    );

    formData.append(
        "language",
        language
    );

    if (condition) {
        formData.append(
            "condition",
            condition
        );
    }

    const response =
        await fetch(
            `${API_URL}/upload`,
            {
                method: "POST",
                credentials: "include",
                body: formData
            }
        );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "حدث خطأ أثناء رفع الصورة."
        );
    }

    return data;
}