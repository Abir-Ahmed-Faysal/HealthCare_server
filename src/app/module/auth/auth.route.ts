import express from 'express';
import { authController } from './auth.controller';
const router = express.Router()


router.post("/register", authController)



export const authRouter = router
