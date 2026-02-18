import express from 'express';
import { SpecialtyRouter } from '../module/speciality.route';
import { hitApi } from '../middleware/hitApi';


const router = express.Router()



router.use("/specialty",hitApi,  SpecialtyRouter)


export const indexRoutes=router

