import { NextFunction, Request, Response } from "express";

export const hitApi = async (req: Request, res: Response, next: NextFunction) => {
    console.log("hit the api and the body is here ", req.body);
    next()
}