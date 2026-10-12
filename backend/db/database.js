import "dotenv/config";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(
    __dirname,
    "schema.sql"
);

const dataPath = path.join(
    __dirname,
    "data.sql"
);

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "archivex",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD
});

async function initializeDatabase() {
    const schema = fs.readFileSync(
        schemaPath,
        "utf8"
    );

    await pool.query(schema);

    const data = fs.readFileSync(
        dataPath,
        "utf8"
    );

    await pool.query(data);
}

await initializeDatabase();

export default pool;