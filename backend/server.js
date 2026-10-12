import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authServer from "./auth/server.js";
import uploaderServer from "./uploader/server.js";

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

app.use(
    "/api/auth",
    authServer
);

app.use(
    "/api/uploader",
    uploaderServer
);

app.listen(PORT, () => {
    console.log(
        `ArchiveX backend running on http://localhost:${PORT}`
    );
});