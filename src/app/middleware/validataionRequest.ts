import { NextFunction, Request, Response } from "express"
import z from "zod"



export const validateRequest = (zodSchema: z.ZodObject) => {



    return (req: Request, res: Response, next: NextFunction) => {
        console.log("here is form the zod",req.body);
        console.log("here is form the zod",req?.file);

        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }
console.log("here is the req body after parsing",req.body);
        const sanitizedData = zodSchema.safeParse(req.body)

        if (!sanitizedData.success) {
            return next(sanitizedData.error)
        }

        req.body = sanitizedData.data


        next()
    }
}