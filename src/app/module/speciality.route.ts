import express from 'express';
import { specialtyController } from './speciality.controller';
import { hitApi } from '../middleware/hitApi';

const router = express.Router()



router.get("/",hitApi, specialtyController.createSpecialty)
router.post("/",hitApi, specialtyController.createSpecialty)
router.patch("/:id",hitApi, specialtyController.createSpecialty)
router.delete("/:id",hitApi, specialtyController.createSpecialty)




export const SpecialtyRouter = router