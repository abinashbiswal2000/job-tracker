import type { Request, Response } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import "dotenv/config"

export async function signup(req: Request, res: Response) {
    
    const { name, email, password } = req.body;

    // Is req.name on track
    // Is req.email on track
    // Is req.password on track
    // If they are all good then we use prisma and add the details in db.
    // Once all is done then we respond with status 200.

    if (!/^[A-Za-z]{2,}$/.test(name)) {
        return res.status(400).json({ error: "Name must be alphabets only, at least 2 letters." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    if (!password || password.length <= 5) {
        return res.status(400).json({ error: "Password must be longer than 5 characters." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            passwordHash: passwordHash
        }
    });

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email
    })

}


export async function signin (req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (user == null) {
        return res.status(401).json({
            message: "Email Doesn't Exist!"
        })
    } 
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (isValid == false) {
        return res.status(401).json({
            message: "Incorrect password!" 
        })
    }

    const payload = {
        userId: user.id
    }
    const optionsObj : jwt.SignOptions = {expiresIn: "1d"};
    const secretKey = process.env.JWT_SECRET;
    if (secretKey == null) {
        throw new Error("secret key is not a string");
    }
    const token = jwt.sign(payload, secretKey, optionsObj)

    res.status(200).json({
        jwt: token
    })

}

export async function deleteUser (req : Request, res : Response) {
    const userId = req.userId;
    if (userId == null) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }
    await prisma.user.delete({
        where: {
            id: userId
        }
    })
    res.status(200).json({
        message: `User with id: ${userId} has been successfully deleted.`
    });
}