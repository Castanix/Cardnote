import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

const config = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    // Gives 'Bearer <token>'
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // to just obtain token

    if (!token) {
        req.body.user = "public";
        return next();
    }

    try {
        const decoded = jwt.verify(token, config.SECRET_TOKEN as Secret);
        req.body.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid token");
    };

    return next();
};

export default verifyToken;