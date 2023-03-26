import { Router } from "express";
import cardsetRoute from "./routes/Cardset";
import cardRoute from "./routes/Card";
import accountRoute from "./routes/Account";


const apiRouter = Router();

apiRouter.use("/account", accountRoute);
apiRouter.use("/cardset", cardsetRoute);
apiRouter.use("/card", cardRoute);




export default apiRouter;