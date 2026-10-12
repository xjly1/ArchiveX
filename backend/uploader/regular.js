import path from "path";
import { spawn } from "child_process";

const PROJECT_ROOT = path.resolve(
    import.meta.dirname,
    "../.."
);

const OCR_SCRIPTS = {
    ar: path.join(
        PROJECT_ROOT,
        "ocr",
        "ar",
        "run.ps1"
    ),

    en: path.join(
        PROJECT_ROOT,
        "ocr",
        "en",
        "run.ps1"
    )
};

function runOCR(scriptPath, imagePath) {
    return new Promise((resolve, reject) => {
        const process = spawn(
            "powershell.exe",
            [
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                scriptPath,
                imagePath
            ],
            {
                cwd: PROJECT_ROOT,
                windowsHide: true
            }
        );

        let stdout = "";
        let stderr = "";

        process.stdout.setEncoding("utf8");
        process.stderr.setEncoding("utf8");

        process.stdout.on(
            "data",
            (data) => {
                stdout += data;
            }
        );

        process.stderr.on(
            "data",
            (data) => {
                stderr += data;
            }
        );

        process.on(
            "error",
            (error) => {
                reject(error);
            }
        );

        process.on(
            "close",
            (code) => {
                if (code !== 0) {
                    const error = new Error(
                        stderr.trim() ||
                        `OCR process failed with code ${code}.`
                    );

                    error.code = code;

                    return reject(error);
                }

                resolve(
                    stdout.trim()
                );
            }
        );
    });
}

async function regularWorkflow(
    process,
    language
) {
    if (!process?.imagePath) {
        throw new Error(
            "Process image path is missing."
        );
    }

    if (!OCR_SCRIPTS[language]) {
        throw new Error(
            `Unsupported OCR language: ${language}`
        );
    }

    const extractedText = await runOCR(
        OCR_SCRIPTS[language],
        process.imagePath
    );

    return extractedText;
}

export default regularWorkflow;