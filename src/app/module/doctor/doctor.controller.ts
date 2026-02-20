import { StatusCodes } from "http-status-codes"
import { doctorService } from "./doctor.service"
import { sendRes } from "../../shared/sendRes"
import { catchAsync } from "../../shared/catchAsync"
import { Request, Response } from "express"

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {

    const result = await doctorService.getAllDoctor()

    return sendRes(res, { statusCode: StatusCodes.OK, success: true, message: "new Patient data create successfully", data: result })
})

const getDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await doctorService.getDoctor(req.params.id as string)

    return sendRes(res, { statusCode: StatusCodes.OK, success: true, message: "new Patient data create successfully", data: result })
})








export const doctorController = {
    getAllDoctors,
    getDoctor,
}