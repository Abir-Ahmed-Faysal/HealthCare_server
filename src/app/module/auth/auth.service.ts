import { UserStatus } from "../../../generated/prisma/enums";
import auth from "../../lib/auth";
import { prisma } from "../../lib/prisma";



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

        }
    })


    if (!data.user) {
        throw new Error("Failed to register user")
    }

    //TODO : fill up  patient schema with transation session

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

        return { ...data, patient }
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
        throw new Error("user deleted")
    }

    if (data.user.status === UserStatus.BLOCKED) {
        throw new Error("login blocked")
    }

    return data?.user

}



export const authService = { registerPatient, login }
