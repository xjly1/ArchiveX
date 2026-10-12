# ArchiveX - Intelligent Archiving System

## Project Idea

ArchiveX is an intelligent document archiving system designed to digitize document management by extracting text from images using Optical Character Recognition (OCR), then storing and organizing the extracted information for efficient retrieval and long-term archiving.

The system aims to reduce reliance on paper-based documentation by transforming image-based documents into searchable digital records. It processes images, extracts their textual content, and archives the resulting data in a database, with support for organizing archived records into ZIP files.

ArchiveX seeks to improve document accessibility, organization, and preservation while promoting a transition toward more efficient, technology-driven, and paperless workflows.

## Project Overview

ArchiveX (Intelligent Archiving System) is a document management system that extracts text from images using Optical Character Recognition (OCR), then reviews and stores the results in a database.

The main goal is to reduce paper usage by converting documents into digital records that are easier to organize, search, and preserve.

OCR results may contain errors, so human review is required before documents are permanently archived.

### User Roles

1. Upload Employee

* Uploads one or more images.
* Monitors processing progress through the dashboard.
* Sees when processing is complete but does not review the extracted text.

The original images and extracted text are temporarily stored in the `review` database table.

2. Review Employee

* Views the original images and extracted text.
* Checks the extracted text against the original images.
* Corrects errors and saves the results for the Manager's review.

3. Manager

* Adds, edits, and removes employee accounts.
* Monitors employee activities.
* Reviews verified documents.
* Approves documents for archiving or rejects them for further correction.
* Creates database backups.

Approved documents are compressed and stored in the `storage` database table. Rejected documents return to the review stage.

### Project Structure

* `backend/`

  The main processing and decision-making layer. It handles application operations and starts OCR tasks.

* `frontend/`

  Contains the user interface, page designs, API communication, and page logic.

* `ocr/`

  Contains the Qwen OCR models, their engines, and language-specific resources for Arabic and English.

* `processes/`

  Manages separate image-processing tasks. Each uploaded image gets its own UUID-named directory containing the original image and its processing files. This separation helps prevent one failed task from directly affecting other tasks.

* `processing/`

  Contains Python scripts and helper files used by OCR workflows during processing.

* `scripts/`

  Contains development and local environment utility scripts.

  * `check-cuda.js` — Checks whether the computer's GPU supports CUDA, helping determine whether the local system can use CUDA-compatible GPU acceleration.

* `test/`

  Contains test images and tools for estimating how many OCR tasks a local computer can handle safely.

### Local Processing and Server Deployment

The `processes/`, `scripts/`, and `test/` directories were introduced during development to support running the entire system on a personal computer.

The `processes/` directory isolates individual image-processing tasks using UUID-named directories. This helps manage multiple uploads independently and makes failures easier to isolate.

The `scripts/` directory contains local environment utility scripts. Its `check-cuda.js` script checks whether the local computer's GPU supports CUDA, helping assess whether CUDA-based GPU acceleration is available for OCR processing.

The `test/` directory is used to estimate the computer's OCR processing capacity. It runs OCR tests on sample images while monitoring system resources, including CPU, RAM, GPU, and temperature. If resource usage exceeds configured safety limits, the test stops. The results help estimate a suitable number of concurrent OCR tasks for that machine.

These local development utilities are mainly useful during development or when running ArchiveX entirely on a personal computer, such as a laptop or desktop PC.

The `scripts/check-cuda.js` file checks the computer's GPU capabilities and generates a `config.json` file that records the selected OCR processing device: `cuda`, `cpu`, or `gpu`, depending on the computer's hardware capabilities and the supported processing configuration. This configuration helps the application determine which processing device to use for OCR tasks.

The generated `config.json` file is intended for local execution and may be unnecessary in a server-based deployment where the OCR processing environment and device configuration are managed separately. Similarly, the `test/` directory is primarily used to estimate the local computer's safe OCR concurrency capacity and is generally unnecessary when processing resources are managed on a dedicated server.

These utilities were introduced during development to facilitate local testing and allow anyone who wants to run the entire ArchiveX system on their own computer to check GPU compatibility, configure OCR processing, and estimate the machine's processing capacity. When OCR processing and the database are deployed on a dedicated server, the need for these utilities depends on the server's configuration and the application's deployment architecture.


In a server-based deployment, `processes/` may also be unnecessary if the server-side processing architecture does not use local per-task directories. Whether it can be removed depends on how the backend and OCR workflows are implemented.

### Document Processing Workflow

1. The Upload Employee submits images.
2. The system runs OCR and temporarily stores the original images and extracted text in `review`.
3. The Review Employee checks and corrects the extracted text.
4. The Manager reviews the corrected records.
5. Approved records are compressed and stored in `storage`; rejected records return for correction.
6. The Manager can create database backups.

ArchiveX combines automated text extraction with human verification and administrative approval to improve document accuracy, organization, and digital preservation.


## Installation Guide

Follow the steps below to set up ArchiveX on a Windows machine.

### Prerequisites

Before installing ArchiveX, make sure the following software is installed.

| Software | Required version                    |
| -------- | ----------------------------------- |
| Node.js  | `24.19.0` or newer                  |
| npm      | `11.17.0` or newer                  |
| pnpm     | `11.20.0` or newer                  |
| Python   | `3.12.10` for both OCR environments |
| Git      | Required if cloning the repository  |

#### 1. Verify the installed versions

Open PowerShell and run:

```powershell
node --version
npm --version
python --version
git --version
```

Ensure Node.js, npm, and Python meet the required versions.

#### 2. Install pnpm

Install pnpm globally using npm:

```powershell
npm install --global pnpm
```

Verify the installation:

```powershell
pnpm --version
```

Make sure the installed version is `11.20.0` or newer.

### Download the Repository

#### Option A: Clone using Git

Navigate to the directory where you want to store the project, then run:

```powershell
git clone <REPOSITORY_URL>
cd ArchiveX
```

Replace `<REPOSITORY_URL>` with the actual GitHub repository URL.

#### Option B: Download as a ZIP archive

1. Open the ArchiveX repository on GitHub.
2. Click **Code → Download ZIP**.
3. Extract the downloaded archive.
4. Open PowerShell in the extracted project root.

### Install Node.js Dependencies

#### 3. Initialize the root project

From the project root, initialize the package configuration and install the root dependencies:

```powershell
pnpm init
pnpm install
```

**Note:** Run `pnpm init` only if the root `package.json` does not already exist. If the repository includes a committed `package.json`, skip initialization and run `pnpm install` directly.

If the repository includes a `pnpm-lock.yaml`, preserve it and use the existing lockfile rather than regenerating the project configuration unnecessarily.

#### 4. Install backend dependencies

```powershell
cd backend
pnpm install
cd ..
```

#### 5. Install frontend dependencies

```powershell
cd frontend
pnpm install
cd ..
```

Return to the project root before proceeding.

### Set Up the OCR Environments

ArchiveX uses separate Python environments for Arabic and English OCR. Each environment must contain its own dependencies and language-specific resources.

#### 6. Create the Arabic environment

Open PowerShell in the project root and run:

```powershell
cd ocr\ar

py -3.12 --version

py -3.12 -m venv .venv_ar

.\.venv_ar\Scripts\Activate.ps1

python --version

python -m pip install --upgrade pip
```

The Python version should be `3.12.10`.

If PowerShell blocks script activation, you can run the environment's Python executable directly instead of changing the system-wide execution policy.

To leave the environment:

```powershell
deactivate
```

#### 7. Create the English environment

Return to the project root, then run:

```powershell
cd ocr\en

py -3.12 --version

py -3.12 -m venv .venv_en

.\.venv_en\Scripts\Activate.ps1

python --version

python -m pip install --upgrade pip
```

The English and Arabic environments must remain separate because each language may require different models, libraries, and configurations.

### Install OCR Dependencies

#### 8. Install the required Python libraries

Open `ArchiveX_Tech.md` in the repository root and follow its dependency specifications for each language.

Install the libraries listed for Arabic in the `ocr\ar` environment, then repeat the process for English in `ocr\en`.

**Important:** Install PyTorch (`torch`) and related packages according to the GPU compatibility checks below before installing other packages that may depend on them.

#### 9. Check NVIDIA GPU and CUDA availability

First, check whether an NVIDIA GPU and its driver are available:

```powershell
nvidia-smi
```

If the command succeeds, inspect the reported GPU model, driver version, and CUDA compatibility information.

If `nvidia-smi` is unavailable, this does not conclusively prove that no GPU exists. Check Device Manager and the installed GPU driver as well.

Next, activate the relevant Python environment and check whether PyTorch can access CUDA:

```powershell
python -c "import torch; print('PyTorch:', torch.__version__); print('CUDA available:', torch.cuda.is_available()); print('PyTorch CUDA build:', torch.version.cuda); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')"
```

Interpret the results as follows:

* If `torch.cuda.is_available()` returns `True`, PyTorch can access a compatible CUDA device.
* If it returns `False`, the installed PyTorch build, NVIDIA driver, hardware, or runtime configuration may not support CUDA correctly.

If necessary, install a compatible PyTorch build using the official selector:

https://pytorch.org/get-started/locally/

Choose the Windows, Pip, and Python options, then select a CUDA build compatible with the system. If CUDA is unavailable or unsupported, select the CPU build.

Repeat the checks and installation independently in both the Arabic and English environments.

#### 10. Install Qwen OCR engines

Create an `engine` directory inside each language folder:

```powershell
New-Item -ItemType Directory -Force -Path .\ocr\ar\engine

New-Item -ItemType Directory -Force -Path .\ocr\en\engine
```

Download or install the specific Qwen model engines listed in `ArchiveX_Tech.md` into their respective directories.

Keep the model files and configurations in the correct language directory. Follow the model-specific requirements for file placement, dependencies, and runtime configuration.

**Note:** Model weights may be large. Ensure sufficient disk space and follow the documented download procedure for each model.

### Final Notes

* Keep the Arabic and English Python environments isolated.
* Install the exact dependencies and model versions specified in `ArchiveX_Tech.md`.
* Do not assume that CUDA is available merely because an NVIDIA GPU is installed.
* Some imports in `ocr.py` may report errors when inspected or executed outside the intended runtime. ArchiveX is designed to run OCR processing through `run.ps1`; follow the project's runtime instructions when testing the complete OCR workflow.
* Do not commit virtual environments, downloaded model weights, generated files, or secrets unless the repository explicitly requires them.
* Before running the application, verify that the backend, frontend, OCR environments, model directories, and configuration files are correctly set up.

## Running ArchiveX

### 1. Install PostgreSQL

Make sure PostgreSQL `18.6` is installed and running on your system.

Verify the installed version:

```powershell
psql --version
```

Ensure the PostgreSQL server is running and that the database connection settings match the project's configuration.

### 2. Start the Application

Open PowerShell in the ArchiveX project root and run:

```powershell
pnpm dev
```

This command starts the backend and frontend development servers.

Wait for both services to finish initializing, then open the local URL displayed in the terminal to access the application.

**Note:** Ensure that PostgreSQL is running and the required database configuration is in place before starting the application.
