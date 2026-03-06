/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import { IAdminUpdatePayload } from "./admin.interface";
import { IUserRequest } from "../interfaces/IUserRequest";



const getAllAdmins = async () => {
  const result = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};



const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!admin) {
    throw new AppError(StatusCodes.NOT_FOUND, "admin not found");
  }

  return admin;
};


const updateAdminProfile = async (
  user: IUserRequest,
  payload: IAdminUpdatePayload
) => {

  const adminData = await prisma.admin.findUniqueOrThrow({
    where: { email: user.email }
  })

  await prisma.$transaction(async (tx) => {

    await tx.admin.update({
      where: { id: adminData.id },
      data: payload
    })

    const userPayload: any = { ...payload }

    if (payload.profilePhoto) {
      userPayload.image = payload.profilePhoto
      delete userPayload.profilePhoto
    }

    await tx.user.update({
      where: { email: user.email },
      data: userPayload
    })

  })

  const result = await prisma.admin.findUniqueOrThrow({
    where: { email: adminData.email },
  })

  return result
}


const deleteAdmin = async (id: string) => {
  const exists = await prisma.admin.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!exists) {
    throw new AppError(StatusCodes.NOT_FOUND, "admin not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: exists.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: id
      }
    })
  });

  return { message: "admin data deleted successfully" };
};



export const adminService = {
  getAllAdmins,
  getAdminById,
  updateAdminProfile,
  deleteAdmin,
};