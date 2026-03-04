import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUserRequest } from "../../interfaces/IUserRequest";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";
import { AppointmentStatus, Role } from "../../../generated/prisma/enums";

// 🔹 Admin → All Appointments
const getAllAppointments = async () => {
  return prisma.appointment.findMany();
};

// 🔹 Doctor/Patient → My Appointments
const getMyAppointments = async (user: IUserRequest) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email,
      isDeleted: false
    }
  });

  if (patientData) {
    return prisma.appointment.findMany({
      where: {
        patientId: patientData.id
      },
      include: {
        doctor: true,
        schedule: true
      }
    });
  }

  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
      isDeleted: false
    }
  });

  if (doctorData) {
    return prisma.appointment.findMany({
      where: {
        doctorId: doctorData.id
      },
      include: {
        doctor: true,
        schedule: true
      }
    });
  }

  throw new AppError(StatusCodes.NOT_FOUND, "user not found");
};

// 🔹 Doctor/Patient → Single My Appointment
const getMySingleAppointment = async (userId: string, id: string) => {
  return prisma.appointment.findFirst({
    where: {
      id,
      OR: [
        { doctorId: userId },
        { patientId: userId }
      ]
    }
  });
};

// 🔹 Patient → Book Appointment
export const bookAppointment = async (
  payload: IBookAppointmentPayload,
  user: IUserRequest
) => {


  const patient = await prisma.patient.findFirstOrThrow({
    where: {
      email: user.email,
      isDeleted: false
    }
  })


  const doctor = await prisma.doctor.findFirstOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false
    }
  })


  const videoCallingId = String(uuid7())


  const result = await prisma.$transaction(async (tx) => {


    const scheduleUpdate = await tx.doctorSchedule.updateMany({
      where: {
        doctorId: doctor.id,
        scheduleId: payload.scheduleId,
        isBooked: false
      },
      data: {
        isBooked: true
      }
    })

    if (scheduleUpdate.count === 0) {
      throw new AppError(StatusCodes.CONFLICT, "This schedule is already booked")
    }


    const appointment = await tx.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        scheduleId: payload.scheduleId,
        videoCallingId
      },
      include: {
        doctor: true,
        patient: true,
        schedule: true
      }
    })

    /**
     * STEP C (Optional Future):
     * Payment Integration Placeholder
     */
    // const payment = await tx.payment.create({...})

    return appointment
  })

  return result
}

// 🔹 Change Appointment Status
const changeAppointmentStatus = async (
  appointmentId: string,
  requestedStatus: AppointmentStatus,
  user: IUserRequest
) => {

  if (!Object.values(AppointmentStatus).includes(requestedStatus)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid requested status");
  }

  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
    include: { doctor: true, patient: true }
  })


  if (
    user.role === Role.DOCTOR &&
    appointment.doctor.email !== user.email
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, "Not authorized")
  }

  if (
    user.role === Role.PATIENT &&
    appointment.patient.email !== user.email
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, "Not authorized")
  }

  const currentStatus = appointment.appointmentStatus
  let nextStatus: AppointmentStatus | null = null


  if (user.role === Role.DOCTOR) {

    if (currentStatus === AppointmentStatus.SCHEDULED &&
      requestedStatus === AppointmentStatus.ONPROGRESS) {
      nextStatus = AppointmentStatus.ONPROGRESS
    }

    else if (currentStatus === AppointmentStatus.ONPROGRESS &&
      requestedStatus === AppointmentStatus.COMPLETE) {
      nextStatus = AppointmentStatus.COMPLETE
    }

    else {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status transition")
    }

  }

  else if (user.role === Role.PATIENT) {

    if (currentStatus === AppointmentStatus.SCHEDULED) {
      nextStatus = AppointmentStatus.CANCELLED
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, "Cannot cancel now")
    }

  } else if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    nextStatus = requestedStatus
  }

  if (!nextStatus) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to determine next status");
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { appointmentStatus: nextStatus }
  })

  return { message: "Appointment status updated successfully" }
}

export const AppointmentService = {
  getAllAppointments,
  getMyAppointments,
  getMySingleAppointment,
  bookAppointment,
  changeAppointmentStatus,
};
