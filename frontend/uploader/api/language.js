const API_URL = "http://localhost:3000/api/uploader";

export async function updateLanguage(language) {
    const response = await fetch(
        `${API_URL}/language`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                language
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "فشل تحديث اللغة"
        );
    }

    return data;
}
