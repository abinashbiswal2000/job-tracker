import express from "express";
import userRouter from "./Routes/UserRoutes.js"
import jobRouter from "./Routes/JobRoutes.js"
import errorHandler from "./Middlewares/ErrorHandler.js"
import cors from "cors"
import "dotenv/config"

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(userRouter);
app.use(jobRouter);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {console.log(`Server running http://localhost:${PORT}`)});
