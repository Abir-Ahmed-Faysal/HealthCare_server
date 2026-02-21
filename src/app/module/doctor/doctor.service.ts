import { prisma } from "../../lib/prisma"

const getAllDoctor = async () => {

    const result = await prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialties: true
                }
            }
        }
    })
    return result

}


const getDoctor = async (id: string) => {

    const result = await prisma.doctor.findUnique({
        where: { id }, include: {
            user: true,
            specialties: {
                include: {
                    specialties: true
                }
            }
        }
    })
    return result
}


// const updateDoctor = async (id: string, payload) => {




//     const result = await prisma.doctor.findUnique({ where: { id } })
//     if (!result) throw new AppError(,"no doctor found")





//     return result

// }




export const doctorService = {
    // updateDoctor,
    getAllDoctor, getDoctor
}