import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendRes } from "../../shared/sendRes";
import { AppointmentService } from "./appointment.service";
import { IUserRequest } from "../../interfaces/IUserRequest";

// 🔹 All
const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentService.getAllAppointments();

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "All appointments fetched successfully",
    data: result,
  });
});

// 🔹 My
const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
  const user = req.user

  const result = await AppointmentService.getMyAppointments(user as IUserRequest);

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "My appointments fetched successfully",
    data: result,
  });
});

// 🔹 My Single
const getMySingleAppointment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await AppointmentService.getMySingleAppointment(userId, id);

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "Appointment fetched successfully",
    data: result,
  });
});

// 🔹 Book
const bookAppointment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const payload = req.body

  const result = await AppointmentService.bookAppointment(payload, user as IUserRequest)

  sendRes(res, {
    statusCode: 201,
    success: true,
    message: "Appointment booked successfully",
    data: result,
  });
});

// 🔹 Change
const changeAppointmentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AppointmentService.changeAppointmentStatus(
    id,
    req.body
  );

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "Appointment status changed successfully",
    data: result,
  });
});

export const AppointmentController = {
  getAllAppointments,
  getMyAppointments,
  getMySingleAppointment,
  bookAppointment,
  changeAppointmentStatus,
};