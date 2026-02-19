import express from 'express';
import { specialtyController } from './speciality.controller';
import { hitApi } from '../middleware/hitApi';

const router = express.Router()



router.get("/",hitApi, specialtyController.getAllSpecialty)
router.post("/",hitApi, specialtyController.createSpecialty)
router.patch("/:id",hitApi, specialtyController.updateSpecialty)
router.delete("/:id",hitApi, specialtyController.deleteSpecialty)




export const SpecialtyRouter = router