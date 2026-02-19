import express from 'express';
import { SpecialtyRouter } from '../module/specialty/speciality.route';
import { hitApi } from '../middleware/hitApi';
import { authRouter } from '../module/auth/auth.route';


const router = express.Router()



router.use("/auth", hitApi, authRouter)
router.use("/specialty", hitApi, SpecialtyRouter)


export const indexRoutes = router

