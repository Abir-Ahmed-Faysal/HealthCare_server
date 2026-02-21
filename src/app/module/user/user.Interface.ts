import { Gender } from "../../../generated/prisma/enums";




export interface ICreateDoctorPayload {
    password: string;
    doctor: {
        name: string;
        email: string;
        profilePhoto?: string;
        address?: string;
        contactNumber?: string;
        registrationNUmber: string;
        experience?: number;
        gender: Gender;
        appointmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
    },
    specialties: string[]
}



/**
 make a json data for posting new doctor
 */
/*
{
    "password": "12345678@",
    "doctor": {
        "name": "Md Faysal Ahmed",
        "email": "faysal@gmail.com",
        "profilePhoto": "http://example.com",
        "address": "Satkhira,Khulna,Bangladesh",
        "contactNumber": "01779161032",
        "registrationNUmber": "Reg-1234",
        "experience": 5,
        "gender": "MALE",
        "appointmentFee": 1000,
        "qualification": "MBBS, MD, MS, FRCOG, FACC, FRCP,  FRCS, FRCP(GP)",
        "currentWorkingPlace": "Dhaka Medical College",
        "designation": "Senior Doctor"
    },
    "specialties": [
        "019c7ba6-bd42-72db-a945-42f988f3eb5d"
    ],
    }



 */