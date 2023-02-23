import { Router } from "express";
import cardsetRoute from "./routes/Cardset";


const apiRouter = Router();

apiRouter.use("/cardset", cardsetRoute);



export default apiRouter;