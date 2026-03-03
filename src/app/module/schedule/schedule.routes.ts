import express from 'express';
import { authCheck } from '../../middleware/authCheck';
import { Role } from '../../../generated/prisma/enums';
import { scheduleController } from './schedule.controller';


const router = express.Router()



router.get('/', authCheck(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), scheduleController.getAllSchedule)
router.get('/:id', authCheck(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), scheduleController.getScheduleById)
router.post('/', authCheck(Role.ADMIN, Role.SUPER_ADMIN), scheduleController.createSchedule)
router.patch('/:id', authCheck(Role.SUPER_ADMIN, Role.ADMIN,), scheduleController.updateSchedule)
router.delete('/:id', authCheck(Role.SUPER_ADMIN, Role.ADMIN,), scheduleController.deleteSchedule)

