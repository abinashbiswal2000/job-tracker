import { Router } from "express";

import authMiddleWare from "../Middlewares/AuthMiddleware.js";

import { signup } from "../Controllers/UserControllers.js";
import { signin } from "../Controllers/UserControllers.js";
import { deleteUser } from "../Controllers/UserControllers.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.delete("/users/me", authMiddleWare, deleteUser);

export default router;