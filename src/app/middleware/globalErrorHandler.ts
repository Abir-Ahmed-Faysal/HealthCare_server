/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../env";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (error: any, req: Request, res: Response, _: NextFunction) => {

    if (envVars.NODE_ENV === "development") {
        console.log("Error form Global Error Handler", error);
    }


    // eslint-disable-next-line prefer-const
    let statusCode: number = 500
    // eslint-disable-next-line prefer-const
    let message: string = "internal Server error"



    res.status(statusCode).json({ success: false, message, error: error.message || message })

}