import { Router } from "express";
import { userController } from "./user.controller";




const router = Router()


router.post("/create-doctor", userController.createDoctor)
// router.post("/create-admin", userController.)
// router.post("/create-super-admin", userController.)





export const userRoutes = router