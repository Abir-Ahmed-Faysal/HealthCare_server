import { UserStatus } from "../../../generated/prisma/enums";
import auth from "../../lib/auth";



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

    // const patient = prisma.patient .$transaction(async(tx)=>{

    // const patient = await tx.create

    // })

    return data
}



const login= async (payload: ILoginPayload) => {
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

    if(data.user.status===UserStatus.BLOCKED){
        throw new Error ("login blocked")
    }

    return data?.user

}



export const authService = { registerPatient,  login}