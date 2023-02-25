import { Router } from "express";
import cardsetRoute from "./routes/Cardset";
import cardRoute from "./routes/Card";


const apiRouter = Router();

apiRouter.use("/cardset", cardsetRoute);
apiRouter.use("/card", cardRoute);



export default apiRouter;