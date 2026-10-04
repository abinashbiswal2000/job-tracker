import type { Request, Response } from "express";
import { prisma } from "../db.js";

export async function addJob(req: Request, res: Response) {
    const userId = req.userId;
    if (userId == null) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }
    const { companyName, position, status, appliedOn } = req.body;
    if (companyName == null || companyName === "") {
        return res.status(400).json({
            error: "Company Name is required."
        })
    } else if (position == null || position === "") {
        return res.status(400).json({
            error: "Position is required."
        })
    }
    const newJob = await prisma.jobApplication.create({
        data: {
            companyName: companyName,
            position: position,
            status: status,
            appliedOn: appliedOn,
            userId: userId
        }
    })
    res.status(201).json({
        jobId: newJob.id
    })
}

export async function getAllJobs(req: Request, res: Response) {
    if (req.userId == null) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }
    const allJobs = await prisma.jobApplication.findMany({
        where: {
            userId: req.userId
        }
    })
    res.status(200).json({
        jobs: allJobs
    })
}

export async function getOneJob (req : Request, res : Response) {
    try {

        if (req.userId == null) {
            return res.status(401).json({
                message: "Could Not Authenticate User"
            })
        }
        
        const data = await prisma.jobApplication.findUnique({
            where: {
                id: Number(req.params.id),
                userId: req.userId
            }
        })
        res.status(200).json({
            job: data
        });
    } catch (e) {
        console.error(e);
    }
}

export async function updateJob(req: Request, res: Response) {
    if (req.userId == null) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }
    const { companyName, position, status, appliedOn } = req.body;
    const data = { companyName, position, status, appliedOn };
    const updatedJob = await prisma.jobApplication.update({
        where: {
            id: Number(req.params.id),
            userId: req.userId
        }, data: data
    })
    res.status(200).json({
        updatedJob: updatedJob
    });
}

export async function deleteJob(req: Request, res: Response) {
    if (req.userId == null) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }
    try {
        const deletedJob = await prisma.jobApplication.delete({
            where: {
                id: Number(req.params.id),
                userId: req.userId
            }
        })
        res.status(200).json({ deletedJob: deletedJob });
    } catch (e : any) {
        if (e.code === "P2025") {
            return res.status(404).json({ error: "Job not found." });
        }
        throw e;
    }
}