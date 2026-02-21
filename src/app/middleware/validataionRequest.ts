import { NextFunction, Request, Response } from "express"
import z from "zod"



export const validateRequest = (zodSchema: z.ZodObject) => {

    return (req: Request, res: Response, next: NextFunction) => {
        const sanitizedData = zodSchema.safeParse(req.body)

        if (!sanitizedData.success) {
          return  next(sanitizedData.error)
        }

        req.body = sanitizedData.data

      
        next()
    }
}