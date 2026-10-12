import fs from "fs/promises";

async function cleanupProcess(process) {
    if (!process?.processDir) {
        throw new Error(
            "Process directory is missing."
        );
    }

    const processDir = process.processDir;

    await fs.rm(
        processDir,
        {
            recursive: true,
            force: false
        }
    );

    return true;
}

export default cleanupProcess;