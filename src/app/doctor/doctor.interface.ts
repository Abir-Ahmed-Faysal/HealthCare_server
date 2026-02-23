import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateDoctorPayload {
    name?: string;
    profilePhoto?: string;
    address?: string;
    experience?: number;
    contactNumber?: string;
    registrationNUmber: string;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    specialties?: string[];
}



