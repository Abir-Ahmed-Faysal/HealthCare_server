import auth from "../../lib/auth";


interface IRegisterPatientPayload {
    name: string;
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


    return data?.user
}




export const authService = { registerPatient }