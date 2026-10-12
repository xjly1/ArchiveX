const API_URL = "http://localhost:3000/api/auth";

export async function logout() {
    const response = await fetch(
        `${API_URL}/logout`,
        {
            method: "POST",
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "فشل تسجيل الخروج"
        );
    }

    return data;
}
