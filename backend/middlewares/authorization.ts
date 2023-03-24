import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const config = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	// Gives 'Bearer <token>'
	const authHeader = req.headers.authorization ?? req.body.headers.Authorization;
	const token = authHeader?.split(" ")[1]; // to just obtain token

	if (!token || token === "public") {
		req.body.user = "public";
		return next();
	}

	try {
		const decoded = jwt.verify(token, config.SECRET_TOKEN as Secret) as JwtPayload;
        const nowMS = Date.now();

        if ((decoded.exp ?? nowMS) < (nowMS / 1000)) {
            return res.status(401).send("Token expired");
        }

        req.body.user = decoded.username;
	} catch (err) {
		return res.status(401).send("Invalid token");
	}

	return next();
};

const generateAccessToken = (username: string) => {
	return jwt.sign({ username }, config.SECRET_TOKEN as Secret, { expiresIn: "6h" });
};

export {
	verifyToken,
	generateAccessToken
};