import { StatusCodes } from "http-status-codes";
import { UserStatus } from "../../../generated/prisma/enums";
import auth from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { tokenUtils } from "../../utilities/token";




interface IRegisterPatientPayload {
    name: string;
    email: string,
    password: string

}

interface ILoginPayload {
    email: string,
    password: string
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
    const { name, email, password } = payload


    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            needPasswordChange: false

        }
    })


    if (!data.user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Failed to register user")
    }



    try {
        const patient = await prisma.$transaction(async (tx) => {

            const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email
                }
            })

            return patientTx
        })




        const accessToken = tokenUtils.getAccessToken({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            emailVerified: data.user.emailVerified,
            isDeleted: data.user.isDeleted,
            isBlocked: data.user.status,
        })

        const refreshToken = tokenUtils.getRefreshToken({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            emailVerified: data.user.emailVerified,
            isDeleted: data.user.isDeleted,
            isBlocked: data.user.status,
        })

        return { accessToken, refreshToken, ...data, patient }
    } catch (error) {
        console.log("transition error:", error);

        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw error
    }
}



const login = async (payload: ILoginPayload) => {
    const { email, password } = payload

    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })


    if (data.user.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, "user deleted")
    }

    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(StatusCodes.FORBIDDEN, "login blocked")
    }

    const accessToken = tokenUtils.getAccessToken({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        emailVerified: data.user.emailVerified,
        isDeleted: data.user.isDeleted,
        isBlocked: data.user.status,
    })

    const refreshToken = tokenUtils.getRefreshToken({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        emailVerified: data.user.emailVerified,
        isDeleted: data.user.isDeleted,
        isBlocked: data.user.status,
    })

    return { ...data, accessToken, refreshToken }

}



export const authService = { registerPatient, login }
