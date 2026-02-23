import { Router } from "express";
import { DoctorValidation } from "./admin.RequestValidation";
import { adminController } from "./admin.controller";
import { validateRequest } from "../middleware/validataionRequest";


const router = Router()



router.get('/', adminController.getAllAdmins)
router.get('/:id', adminController.getAdmin)
router.patch('/:id', validateRequest(DoctorValidation.updateDoctorValidationSchema), adminController.updateAdmin)
router.delete('/:id', adminController.deleteAdmin)


export const adminRoutes = router

