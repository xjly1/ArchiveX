import {
    getCurrentEmployee
} from "../../auth/api/me.js";

import {
    applyLanguage
} from "./settings.js";

import "./input.js";
import "./upload.js";

async function checkAuthentication() {
    try {
        const data =
            await getCurrentEmployee();

        applyLanguage(
            data.employee.language
        );

    } catch (error) {
        window.location.replace(
            "../../auth/pages/login.html"
        );
    }
}

checkAuthentication();