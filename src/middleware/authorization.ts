import { Request, Response, NextFunction } from "express";

export const createAuthorizationMiddleware = (secret: String) =>
(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization')

    if (authHeader === secret){
        next()
    } else{
        res.sendStatus(401)
    }
}