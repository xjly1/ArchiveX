
import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = resolve(ROOT, "config.json");

const PYTHON_ENVS = [
  {
    name: "Arabic OCR",
    path: resolve(ROOT, "ocr", "ar", ".venv_ar", "Scripts", "python.exe"),
  },
  {
    name: "English OCR",
    path: resolve(ROOT, "ocr", "en", ".venv_en", "Scripts", "python.exe"),
  },
];

function detectCuda(pythonPath, name) {
  const result = spawnSync(
    pythonPath,
    [
      "-c",
      [
        "import json",
        "import torch",
        "available = torch.cuda.is_available()",
        "if available:",
        "    torch.cuda.synchronize()",
        "print(json.dumps({'cuda': 'gpu' if available else 'cpu'}))",
      ].join("\n"),
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
      timeout: 120_000,
      windowsHide: true,
    },
  );

  if (result.error) {
    throw new Error(`${name}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(
      `${name} CUDA check failed:\n${result.stderr || result.stdout}`,
    );
  }

  const output = result.stdout.trim().split(/\r?\n/).at(-1);
  const detected = JSON.parse(output);

  if (!["cpu", "gpu"].includes(detected.cuda)) {
    throw new Error(`${name}: invalid CUDA result.`);
  }

  console.log(`[ArchiveX] ${name}: ${detected.cuda}`);

  return detected.cuda;
}

async function readConfig() {
  try {
    return JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT" || error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }
}

async function main() {
  console.log("[ArchiveX] Checking CUDA environments...");

  const config = await readConfig();

  const results = PYTHON_ENVS.map((env) => {
    return detectCuda(env.path, env.name);
  });

  const cuda = results.every((result) => result === "gpu")
    ? "gpu"
    : "cpu";

  if (config?.cuda === cuda) {
    console.log(`[ArchiveX] Configuration unchanged: cuda=${cuda}`);
    return;
  }

  await writeFile(
    CONFIG_PATH,
    `${JSON.stringify({ ...config, cuda }, null, 2)}\n`,
    "utf8",
  );

  console.log(`[ArchiveX] config.json updated: cuda=${cuda}`);
}

main().catch((error) => {
  console.error("[ArchiveX] Startup check failed:");
  console.error(error.message);
  process.exitCode = 1;
});