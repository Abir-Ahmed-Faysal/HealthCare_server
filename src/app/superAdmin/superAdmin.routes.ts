import { Router } from "express";
import { DoctorValidation } from "./superAdmin.RequestValidation";
import { adminController } from "./superAdmin.controller";
import { validateRequest } from "../middleware/validataionRequest";


const router = Router()



router.get('/', adminController.getAllAdmins)
router.get('/:id', adminController.getAdmin)
router.patch('/:id', validateRequest(DoctorValidation.updateDoctorValidationSchema), adminController.updateAdmin)
router.delete('/:id', adminController.deleteAdmin)


export const superAdminRoutes = router

