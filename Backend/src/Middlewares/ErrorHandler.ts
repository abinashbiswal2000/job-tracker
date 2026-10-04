import type { Request, Response, NextFunction } from "express";

export default function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);
    if (err.code === "P2025") {
        return res.status(404).json({ error: "Not found." });
    } else if (err.code === "P2002") {
        return res.status(409).json({ error: "Already exists." });
    }
    res.status(500).json({ error: "Internal server error" });
}