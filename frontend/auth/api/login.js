const API_URL = "http://localhost:3000/api/auth";

export async function login(username, password) {
    const response = await fetch(
        `${API_URL}/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "فشل تسجيل الدخول"
        );
    }

    return data;
}
