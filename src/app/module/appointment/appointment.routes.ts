import express from 'express';
import { authCheck } from '../../middleware/authCheck';
import { Role } from '../../../generated/prisma/enums';
import { AppointmentController } from './appointment.controller';



const router = express.Router()

router.get(
  "/all-appointments",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  AppointmentController.getAllAppointments
);

router.get(
  "/my-my-appointments",
  authCheck(Role.DOCTOR, Role.PATIENT),
  AppointmentController.getMyAppointments
);

router.get(
  "/my-single-appointment/:id",
  authCheck(Role.PATIENT, Role.DOCTOR),
  AppointmentController.getMySingleAppointment
);

router.post(
  "/book-appointment",
  authCheck(Role.PATIENT),
  AppointmentController.bookAppointment
);

router.patch(
  "/change-appointment/:id",
  authCheck(Role.DOCTOR, Role.PATIENT, Role.ADMIN, Role.SUPER_ADMIN),
  AppointmentController.changeAppointmentStatus
);


export const appointmentRoutes= router