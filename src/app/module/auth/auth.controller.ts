import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendRes } from "../../shared/sendRes";
import { StatusCodes } from "http-status-codes";
import { tokenUtils } from "../../utilities/token";


const registerPatient = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const result = await authService.registerPatient({ name, email, password })

    const { accessToken, refreshToken, token, ...rest } = result


    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.SetBetterAuthSessionCookie(res, token as string)

    return sendRes(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "new Patient data create successfully",
        data: { accessToken, refreshToken, token, ...rest }
    })
})

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const result = await authService.login({ email, password })

    const { accessToken, refreshToken, token, ...rest } = result


    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.SetBetterAuthSessionCookie(res, token)


    sendRes(res, {
        statusCode: StatusCodes.OK,
        message: "login successfully",
        success: true,
        data: { accessToken, refreshToken, token, ...rest }
    })
})


export const authController = {
    registerPatient, login
}