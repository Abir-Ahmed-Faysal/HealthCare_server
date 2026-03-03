import { prisma } from "../../lib/prisma";

// 🔹 Admin → All Appointments
const getAllAppointments = async () => {
  return prisma.appointment.findMany();
};

// 🔹 Doctor/Patient → My Appointments
const getMyAppointments = async (userId: string) => {
  return prisma.appointment.findMany({
    where: {
      OR: [
        { doctorId: userId },
        { patientId: userId }
      ]
    }
  });
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
const bookAppointment = async (patientId: string, payload: any) => {
  return prisma.appointment.create({
    data: {
      ...payload,
      patientId
    }
  });
};

// 🔹 Change Appointment Status
const changeAppointmentStatus = async (id: string, payload: any) => {
  return prisma.appointment.update({
    where: { id },
    data: payload
  });
};

export const AppointmentService = {
  getAllAppointments,
  getMyAppointments,
  getMySingleAppointment,
  bookAppointment,
  changeAppointmentStatus,
};