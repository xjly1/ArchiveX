import { login } from "../api/login.js";

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorElement = document.getElementById("error");

loginForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();
        errorElement.textContent = "";

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        try {
            const data =
                await login(
                    username,
                    password
                );

            usernameInput.value = "";
            passwordInput.value = "";

            window.history.replaceState(
                null,
                "",
                window.location.href
            );

            switch (data.employee.role) {
                case "uploader":
                    window.location.replace(
                        "../../uploader/pages/dashboard.html"
                    );

                    break;

                case "reviewer":
                    window.location.replace(
                        "../../reviewer/pages/dashboard.html"
                    );

                    break;

                case "manager":
                    window.location.replace(
                        "../../manager/pages/dashboard.html"
                    );

                    break;

                default:
                    errorElement.textContent = "دور المستخدم غير معروف.";

            }

        } catch (error) {
            console.error(error);
            errorElement.textContent = error.message;
        }
    }
);
