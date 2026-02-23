import express from 'express';
import { specialtyController } from './speciality.controller';
import { hitApi } from '../../middleware/hitApi';
import { authCheck } from '../../middleware/authCheck';
import { Role } from '../../../generated/prisma/enums';


const router = express.Router()



router.get("/", hitApi, specialtyController.getAllSpecialty)
router.post("/", hitApi, authCheck(Role.SUPER_ADMIN, Role.ADMIN), specialtyController.createSpecialty)
router.patch("/:id", authCheck(Role.SUPER_ADMIN, Role.ADMIN), specialtyController.updateSpecialty)
router.delete("/:id", authCheck(Role.SUPER_ADMIN, Role.ADMIN), specialtyController.deleteSpecialty)




export const SpecialtyRouter = router