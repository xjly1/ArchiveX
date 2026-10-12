# ArchiveX — Main Technologies

## 1. Root Environment

| Technology   | Version   | Description                            |
| ------------ | --------- | -------------------------------------- |
| Node.js      | `24.19.0` | JavaScript runtime environment.        |
| npm          | `11.17.0` | JavaScript package manager.            |
| pnpm         | `11.20.0` | Project dependency manager.            |
| Python       | `3.12.10` | Runtime for OCR scripts.               |
| concurrently | `10.0.5`  | Runs multiple commands simultaneously. |

## 2. Backend

| Technology           | Version  | Description                                           |
| -------------------- | -------- | ----------------------------------------------------- |
| Express.js           | `5.2.1`  | Backend framework and API development.                |
| bcrypt               | `6.0.0`  | Password hashing.                                     |
| cookie-parser        | `1.4.7`  | Parses HTTP cookies.                                  |
| CORS                 | `2.8.6`  | Controls cross-origin requests.                       |
| dotenv               | `18.0.3` | Loads environment variables.                          |
| Multer               | `2.2.0`  | Handles file uploads.                                 |
| node-postgres (`pg`) | `8.23.0` | Connects Node.js to PostgreSQL.                       |
| Sharp                | `0.35.4` | Image processing and conversion.                      |
| Nodemon              | `3.1.14` | Automatically restarts the server during development. |

## 3. Frontend

| Technology           | Version                   | Description                                 |
| -------------------- | ------------------------- | ------------------------------------------- |
| HTML                 | N/A                       | Structures web pages.                       |
| CSS                  | N/A                       | Styles web pages.                           |
| JavaScript (Vanilla) | Browser-supported version | Implements frontend interactions and logic. |
| Vite                 | `8.2.1`                   | Frontend development server and build tool. |

## 4. Arabic OCR

| Technology       | Version      | Description                                      |
| ---------------- | ------------ | ------------------------------------------------ |
| Python           | `3.12.10`    | Runs Arabic OCR scripts.                         |
| PyTorch          | `2.4.1+cpu`  | Executes AI models on the CPU.                   |
| TorchVision      | `0.19.1+cpu` | Computer vision utilities.                       |
| TorchAudio       | `2.4.1`      | Audio processing utilities.                      |
| Transformers     | `4.49.0`     | Loads and runs AI models.                        |
| Qwen VL Utils    | `0.0.14`     | Prepares inputs for Qwen vision-language models. |
| Pillow           | `12.3.0`     | Reads and processes images.                      |
| NumPy            | `2.5.2`      | Numerical computing and array operations.        |
| Hugging Face Hub | `0.36.2`     | Downloads and accesses AI models.                |

**Model:** `Qwen2-VL-2B-Instruct`

## 5. English OCR

| Technology       | Version       | Description                                      |
| ---------------- | ------------- | ------------------------------------------------ |
| Python           | `3.12.10`     | Runs English OCR scripts.                        |
| PyTorch          | `2.14.1`      | Executes AI models.                              |
| TorchVision      | `0.29.1`      | Computer vision utilities.                       |
| Transformers     | `5.15.0`      | Loads and runs AI models.                        |
| Qwen VL Utils    | `0.0.14`      | Prepares inputs for Qwen vision-language models. |
| Pillow           | `12.3.0`      | Reads and processes images.                      |
| NumPy            | `2.5.3`       | Numerical computing and array operations.        |
| Hugging Face Hub | `1.33.0`      | Downloads and accesses AI models.                |

**Model:** `Qwen3-VL-2B-Instruct`

## 6. Database

| Technology           | Version  | Description                            |
| -------------------- | -------- | -------------------------------------- |
| PostgreSQL           | `18.6`   | Relational database management system. |
| node-postgres (`pg`) | `8.23.0` | Node.js PostgreSQL database driver.    |

