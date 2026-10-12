const API_URL = "http://localhost:3000/api/auth";

export async function getCurrentEmployee() {
    const response = await fetch(
        `${API_URL}/me`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Authentication required"
        );
    }

    return data;
}
