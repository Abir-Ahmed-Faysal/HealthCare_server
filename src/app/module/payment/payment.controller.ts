import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendRes } from "../../shared/sendRes";
import { doctorScheduleService } from "./payment.service";

// 🔹 Create My
const createMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.user.id  ;

  const result = await doctorScheduleService.createMyDoctorSchedule(
    doctorId,
    req.body
  );

  sendRes(res, {
    statusCode: 201,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

// 🔹 Get My
const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.user.id;

  const result =
    await doctorScheduleService.getMyDoctorSchedules(doctorId);

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "My schedules fetched successfully",
    data: result,
  });
});

// 🔹 Admin Get All
const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
  const result =
    await doctorScheduleService.getAllDoctorSchedules();

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "All schedules fetched successfully",
    data: result,
  });
});

// 🔹 Get By Id
const getDoctorScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { scheduleId } = req.params;

  const result =
    await doctorScheduleService.getDoctorScheduleById(scheduleId);

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "Schedule fetched successfully",
    data: result,
  });
});

// 🔹 Update My
const updateMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.user.id;
  const { id } = req.params;

  const result =
    await doctorScheduleService.updateMyDoctorSchedule(
      doctorId,
      id,
      req.body
    );

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "Schedule updated successfully",
    data: result,
  });
});

// 🔹 Delete My
const deleteMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.user.id;
  const { id } = req.params;

  const result =
    await doctorScheduleService.deleteMyDoctorSchedule(doctorId, id);

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "Schedule deleted successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  createMyDoctorSchedule,
  getMyDoctorSchedules,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
};