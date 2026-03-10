import { Router } from "express";

import { adminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validataionRequest";
import { authCheck } from "../../middleware/authCheck";
import { Role } from "../../../generated/prisma/enums";
import { adminValidation } from "./admin.RequestValidation";


const router = Router()



router.get('/', authCheck(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllAdmins)
router.get('/:id', authCheck(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAdmin)
router.patch('/:id', authCheck( Role.SUPER_ADMIN), validateRequest(adminValidation.updateAdminValidationSchema), adminController.updateAdmin)
router.delete('/:id', authCheck( Role.SUPER_ADMIN), adminController.deleteAdmin)


export const adminRoutes = router

