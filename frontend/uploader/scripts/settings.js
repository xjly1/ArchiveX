import { logout } from "../../auth/api/logout.js";
import { updateLanguage } from "../api/language.js";

const settingsButton = document.querySelector(".settings-button");
const settingsMenu = document.querySelector(".settings-menu");
const languageButton = document.querySelector(".language-button");
const logoutButton = document.querySelector(".logout-button");

settingsButton.addEventListener(
    "click",
    () => {
        settingsMenu.style.display = settingsMenu.style.display === "block" ? "none" : "block";
    }
);

languageButton.addEventListener(
    "click",
    async () => {
        const currentLanguage = document.documentElement.lang;
        const newLanguage = currentLanguage === "ar" ? "en" : "ar";

        applyLanguage(
            newLanguage
        );

        try {
            await updateLanguage(
                newLanguage
            );
        } catch (error) {
            console.error(error);
            applyLanguage(
                currentLanguage
            );
        }
    }
);

logoutButton.addEventListener(
    "click",
    async () => {
        try {
            await logout();

            window.location.replace(
                "../../auth/pages/login.html"
            );
        } catch (error) {
            console.error(error);
        }
    }
);

export function applyLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    document
        .querySelectorAll("[data-ar][data-en]")
        .forEach((element) => {
            element.textContent =
                language === "ar"
                    ? element.dataset.ar
                    : element.dataset.en;
        });
}
