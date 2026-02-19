import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendRes } from "../../shared/sendRes";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const result = await authService.registerPatient({ name, email, password })

    return sendRes(res, { statusCode: 201, success: true, message: "new Patient data create successfully", data: result })
})





export const authController = {
    registerPatient
}