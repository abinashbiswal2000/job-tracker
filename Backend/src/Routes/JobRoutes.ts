import { Router } from "express";
import { addJob , getAllJobs , getOneJob,  updateJob , deleteJob } from "../Controllers/JobControllers.js"
import authMiddleWare from "../Middlewares/AuthMiddleware.js";

const jobRouter = Router();

jobRouter.post("/jobs", authMiddleWare, addJob);
jobRouter.get("/jobs", authMiddleWare, getAllJobs);
jobRouter.get("/jobs/:id", authMiddleWare, getOneJob);
jobRouter.patch("/jobs/:id", authMiddleWare, updateJob)
jobRouter.delete("/jobs/:id", authMiddleWare, deleteJob)

export default jobRouter;