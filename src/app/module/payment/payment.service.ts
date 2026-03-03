import { prisma } from "../../lib/prisma";


const createMyDoctorSchedule = async (doctorId: string, payload: any) => {
  return prisma.doctorSchedule.create({
    data: {
      ...payload,
      doctorId,
    },
  });
};



const getMyDoctorSchedules = async (doctorId: string) => {
  return prisma.doctorSchedule.findMany({
    where: { doctorId },
  });
};


const getAllDoctorSchedules = async () => {
  return prisma.doctorSchedule.findMany();
};

const getDoctorScheduleById = async (scheduleId: string) => {
  return prisma.doctorSchedule.findUnique({
    where: { id: scheduleId },
  });
};


const updateMyDoctorSchedule = async (
  doctorId: string,
  id: string,
  payload: any
) => {
  return prisma.doctorSchedule.update({
    where: { id, doctorId }, // ownership check
    data: payload,
  });
};


const deleteMyDoctorSchedule = async (doctorId: string, id: string) => {
  return prisma.doctorSchedule.delete({
    where: { id, doctorId },
  });
};

export const doctorScheduleService = {
  createMyDoctorSchedule,
  getMyDoctorSchedules,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
};