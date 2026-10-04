import type { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken"
import "dotenv/config"

interface authPayload {
    userId: number
}

export default function authMiddleWare (req : Request, res : Response, next : NextFunction) {
    // const { token } = req.body; -> Wrong
    const authHeader = req.headers.authorization;
    if (authHeader == null) {
        return res.status(401).json({
            error: "No token provided."
        })
    }
    const [ bearer, token ] = authHeader.split(" ");
    const secretKey = process.env.JWT_SECRET;

    if (token == null) {
        return res.status(401).json({ error: "No token provided." });
    } else if (secretKey == null) {
        throw new Error("No secret key");
    }

    try {
        const jwtPayload = jwt.verify(token, secretKey) as authPayload;
        req.userId = jwtPayload.userId;
        next();
    } catch (e) {
        res.status(401).json({ error: "Invalid or expired token." });
    }

}