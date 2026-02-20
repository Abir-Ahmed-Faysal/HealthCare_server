import express from 'express';
import { SpecialtyRouter } from '../module/specialty/speciality.route';
import { authRouter } from '../module/auth/auth.route';
import { userRoutes } from '../module/user/user.route';
import { doctorRoutes } from '../module/doctor/doctor.routes';


const router = express.Router()



router.use("/auth", authRouter)
router.use("/user", userRoutes)
router.use("/specialty", SpecialtyRouter)
router.use("/doctors", doctorRoutes)


export const indexRoutes = router

