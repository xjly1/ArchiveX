import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const PROJECT_ROOT = path.resolve(
    import.meta.dirname,
    "../.."
);

const PROCESSES_DIR = path.join(
    PROJECT_ROOT,
    "processes"
);

async function createProcess(file) {
    if (!file) {
        throw new Error(
            "No image file was provided."
        );
    }

    const uuid = crypto.randomUUID();

    const processDir = path.join(
        PROCESSES_DIR,
        uuid
    );

    await fs.mkdir(
        processDir,
        {
            recursive: false
        }
    );

    const originalDir = path.join(
        processDir,
        "original"
    );

    await fs.mkdir(
        originalDir,
        {
            recursive: false
        }
    );

    const fileName = path.basename(
        file.originalname
    );

    const imagePath = path.join(
        originalDir,
        fileName
    );

    await fs.writeFile(
        imagePath,
        file.buffer
    );

    const savedFile = await fs.stat(
        imagePath
    );

    if (
        !savedFile.isFile() ||
        savedFile.size !== file.size
    ) {
        throw new Error(
            "Image was not saved correctly."
        );
    }

    return {
    id: uuid,
    processDir,
    originalDir,
    imagePath
    };
}

export default createProcess;