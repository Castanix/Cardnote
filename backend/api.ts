import { Request, Response, Router } from "express";
import cardsetRoute from "./routes/Cardset";
import cardRoute from "./routes/Card";
import accountRoute from "./routes/Account";


const apiRouter = Router();

apiRouter.use("/account", accountRoute);
apiRouter.use("/cardset", cardsetRoute);
apiRouter.use("/card", cardRoute);


// Test route
apiRouter.get("/express_backend", (req: Request, res: Response) => {
	res.status(200).send({
		express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT",
	});
});


export default apiRouter;