import {  Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validataionRequest";
import { createDoctorZodSchema } from "./userRequest.validation";









const router = Router()

router.post("/create-doctor",validateRequest(createDoctorZodSchema), userController.createDoctor)
// router.post("/create-admin", userController.)
// router.post("/create-super-admin", userController.)





export const userRoutes = router