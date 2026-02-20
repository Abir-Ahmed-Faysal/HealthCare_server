import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendRes } from "../../shared/sendRes";
import { userService } from "./user.service";
import { Request, Response } from "express";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const result = await userService.createDoctor(payload)
    return sendRes(res, { statusCode: StatusCodes.OK, success: true, message: "doctor created successfully", data: result })

})


export const userController = {
    createDoctor
}