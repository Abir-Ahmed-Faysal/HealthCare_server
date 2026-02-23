import { StatusCodes } from "http-status-codes"
import { doctorService } from "./doctor.service"
import { sendRes } from "../../shared/sendRes"
import { catchAsync } from "../../shared/catchAsync"
import { Request, Response } from "express"

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {

    const result = await doctorService.getAllDoctors()

    return sendRes(res, { statusCode: StatusCodes.OK, success: true, message: "doctors  data retrieves successfully", data: result })
})

const getDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await doctorService.getDoctorById(req.params.id as string)

    return sendRes(res, { statusCode: StatusCodes.OK, success: true, message: "doctor data retrieve successfully", data: result })
})



const updateDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await doctorService.updateDoctor(req.params.id as string, req.body)

    return sendRes(res, { statusCode: StatusCodes.OK, success: true, message: "doctor data create successfully", data: result })
})



const deleteDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await doctorService.updateDoctor(req.params.id as string, req.body)

    return sendRes(res, { statusCode: StatusCodes.OK, success: true, message: "doctor data delete successfully", data: result })
})
















export const doctorController = {
    getAllDoctors,
    getDoctor,
    updateDoctor,
    deleteDoctor
}