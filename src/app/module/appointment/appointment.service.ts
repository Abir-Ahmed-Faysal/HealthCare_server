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
const changeAppointmentStatus = async (appointmentId: string, appointmentStatus: AppointmentStatus, user: IUserRequest) => {

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId }, include: {
      doctor: true
    }
  })


  if (user.role === Role.DOCTOR) {


    if (appointmentData.doctor.email !== user?.email) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to change this appointment status")
    }

if(appointmentData.status === AppointmentStatus.CANCELLED || appointmentData.status === AppointmentStatus.CONFIRMED){
  throw new AppError(StatusCodes.FORBIDDEN, "You can't change status of this appointment")
}



    await prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        status: appointmentStatus
      }
    })









  } else if (user.role === Role.PATIENT) {
    if (appointmentData.patient.email !== user?.email) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to change this appointment status")
    }
  }





};

export const AppointmentService = {
  getAllAppointments,
  getMyAppointments,
  getMySingleAppointment,
  bookAppointment,
  changeAppointmentStatus,
};
