import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendRes } from "../../shared/sendRes";
import { StatusCodes } from "http-status-codes";


const registerPatient = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const result = await authService.registerPatient({ name, email, password })

    return sendRes(res, { statusCode: StatusCodes.CREATED, success: true, message: "new Patient data create successfully", data: result })
})


const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const result = await authService.login({ email, password })

    sendRes(res, { statusCode: StatusCodes.OK, message: "login successfully", success: true, data: result })
})





export const authController = {
    registerPatient, login
}