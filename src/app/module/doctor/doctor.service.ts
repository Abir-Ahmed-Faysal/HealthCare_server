import { StatusCodes } from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";
import { QueryBuilder } from "../../utilities/QueryBuilder";
import { IQueryParams } from "../../interfaces/query.interface";
import { doctorFilterableFields, doctorIncludeConfig, doctorSearchableFields } from "./doctor.constant";
import { Doctor, Prisma } from "../../../generated/prisma/client";


const getAllDoctors = async (query: IQueryParams) => {
  // // Fetch all non-deleted doctors
  // const result = await prisma.doctor.findMany({
  //   where: {
  //     isDeleted: false,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //     email: true,
  //     profilePhoto: true,
  //     contactNumber: true,
  //     registrationNumber: true,
  //     experience: true,
  //     gender: true,
  //     appointmentFee: true,
  //     qualification: true,
  //     currentWorkingPlace: true,
  //     designation: true,
  //     averageRating: true,
  //     createdAt: true,
  //     updatedAt: true,
  //     specialties: {
  //       select: {
  //         specialties: {
  //           select: {
  //             id: true,
  //             title: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // // Transform specialties (flatten structure)
  // const doctors = result.map((doctor) => ({
  //   ...doctor,
  //   specialties: doctor.specialties.map((s) => s.specialties),
  // }));

  // return doctors;

  const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(prisma.doctor, query, { searchableFields: doctorSearchableFields, filterableFields: doctorFilterableFields })



  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false
    })
    .include({ user: true, specialties: { include: { specialties: true } } })
    .dynamicInclude(doctorIncludeConfig, ['user', 'specialties.specialties', 'appointments', 'schedules.schedule', 'reviews'])
    .paginate()
    .sort()
    .sort()
    .fields()
    .execute()

  /*export const doctorIncludeConfig: Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
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
  
}*/

  return result
};


const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      specialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  // Transform specialties to flatten structure
  return {
    ...doctor,
    specialties: doctor.specialties.map((s) => s.specialties),
  };
};



const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  // Check if doctor exists and not deleted
  const existingDoctor = await prisma.doctor.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existingDoctor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  // Separate specialties from doctor data
  const { specialties, doctor: doctorData } = payload;

  // Update doctor basic information
  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: { id },
        data: doctorData,

      });

    }

    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {

        const { specialtyId, shouldDelete } = specialty


        if (shouldDelete) {
          await tx.doctorSpecialty.deleteMany({
            where: {
              doctorId: id,
              specialtyId: specialtyId,
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId: specialtyId,
              },
            }, create: {
              doctorId: id,
              specialtyId: specialtyId,
            }, update: {

            }
          })
        }
      }
    }
  })


  const doctor = await getDoctorById(id)
  return doctor
};



const deleteDoctor = async (id: string) => {
  const exists = await prisma.doctor.findFirst({
    where: {
      id,
      isDeleted: false
    }
  })

  if (!exists) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found")
  }


  await prisma.$transaction(async (tx) => {

    await tx.user.update({
      where: {
        id: exists.userId
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    await tx.doctor.update({
      where: {
        id
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    await tx.session.deleteMany({
      where: {
        userId: exists.userId
      }
    })


    await tx.doctorSpecialty.deleteMany({
      where: {
        doctorId: id
      }
    })
  })

  return { message: "Doctor deleted successfully" }
}



export const doctorService = {
  updateDoctor, deleteDoctor,
  getAllDoctors, getDoctorById
}