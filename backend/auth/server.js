import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import db from "../db/database.js";

const router = express.Router();
const sessions = new Map();
const SESSION_COOKIE = "archivex_session";

router.post(
    "/login",
    async (req, res) => {
        const {
            username,
            password
        } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: "Username and password are required"
            });
        }

        try {
            const result = await db.query(
                `
                SELECT
                    id,
                    username,
                    password,
                    role,
                    language
                FROM employees
                WHERE username = $1
                `,
                [username]
            );

            const employee = result.rows[0];

            if (!employee) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid username or password"
                });
            }

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    employee.password
                );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid username or password"
                });
            }

            const sessionId = crypto.randomBytes(32).toString("hex");

            sessions.set(
                sessionId,
                {
                    employeeId: employee.id
                }
            );

            res.cookie(
                SESSION_COOKIE,
                sessionId,
                {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: true,
                    maxAge: 1000 * 60 * 60 * 8
                }
            );

            return res.json({
                success: true,
                employee: {
                    id: employee.id,
                    username: employee.username,
                    role: employee.role,
                    language: employee.language
                }
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                error: "Authentication failed"
            });
        }
    }
);

router.post(
    "/logout",
    (req, res) => {
        const sessionId = req.cookies?.[SESSION_COOKIE];

        if (sessionId) {
            sessions.delete(
                sessionId
            );
        }

        res.clearCookie(
            SESSION_COOKIE
        );

        return res.json({
            success: true
        });
    }
);

export async function requireAuth(
    req,
    res,
    next
) {
    const sessionId = req.cookies?.[SESSION_COOKIE];

    if (!sessionId) {
        return res.status(401).json({
            success: false,
            error: "Authentication required"
        });
    }

    const session = sessions.get(sessionId);

    if (!session) {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired session"
        });
    }

    try {
        const result = await db.query(
            `
            SELECT
                id,
                username,
                role,
                language
            FROM employees
            WHERE id = $1
            `,
            [session.employeeId]
        );

        const employee = result.rows[0];

        if (!employee) {
            sessions.delete(
                sessionId
            );

            res.clearCookie(
                SESSION_COOKIE
            );

            return res.status(401).json({
                success: false,
                error: "Employee not found"
            });
        }

        req.employee = employee;

        next();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Authentication failed"
        });
    }
}

router.get(
    "/me",
    requireAuth,
    (req, res) => {
        return res.json({
            success: true,
            employee: req.employee
        });
    }
);

export default router;