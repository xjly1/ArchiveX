import express from "express";
import multer from "multer";
import { requireAuth } from "../auth/server.js";
import uploadWorkflow from "./workflow.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
    "/upload",
    requireAuth,
    upload.single("image"),

    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No image was uploaded."
                });
            }

            if (!req.body.language) {
                return res.status(400).json({
                    success: false,
                    error: "Language is required."
                });
            }

            await uploadWorkflow(
                req.file,
                req.body.language,
                req.body.condition
            );

            return res.json({
                success: true
            });

        } catch (error) {
            console.error(
                "Upload workflow failed:",
                error
            );

            return res.status(
                error.status || 500
            ).json({
                success: false,
                error:
                    error.message ||
                    "حدث خطأ أثناء معالجة الصورة."
            });
        }
    }
);

export default router;