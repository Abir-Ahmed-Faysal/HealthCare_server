import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields = ["name", "email", "contactNumber", "specialties.specialties.title"];

export const doctorFilterableFields = ["appointmentFee", "name", "email", "contactNumber", "specialties.specialties.title", 'designation', 'qualification','gender'];


export const doctorIncludeConfig: Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    specialties: {
        include: {
            specialties: true
        }
    }, appointments: {
        include: {
            patient: true,
            doctor: true,
            prescriptions: true,
        }
    },
     schedules: {
        include: {
            schedule: true
        }
    },reviews:true
    
}