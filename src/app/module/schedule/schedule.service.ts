import { addHours, addMinutes, format } from "date-fns"
import { prisma } from "../../lib/prisma"
import { ICreateSchedulePayload } from "./schedule.interface"


const createSchedule = async (payload: ICreateSchedulePayload) => {

    const { startDate, endDate, startTime, endTime } = payload

    //make a time interval


    const interval = 30 //30 minutes interval

    const currentDate = new Date(startDate);
    const endDate = new Date(endDate)

    const schedule = []

    while (currentDate <= endDate) {
        const startDateTime = new Date(currentDate)

        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM--dd")}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            ))

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(endDate, "yyy-DD-mm")}`,
                    Number(endTime, split(':')[0])
                ),
                Number(endTime.split(':')[1])
            ))

    }

}






const getAllSchedule = async (query) => {
    const result = await prisma.doctorSchedule.create({
        data: {
            ...payload
        }
    })

    const query


    return result
}

const getScheduleById = async (payload) => {
    const result = await prisma.doctorSchedule.create({
        data: {
            ...payload
        }
    })
    return result
}

const updateSchedule = async (id: string, payload) => {
    const result = await prisma.doctorSchedule.create({
        data: {
            ...payload
        }
    })
    return result
}

const deleteSchedule = async (id: string, payload) => {
    const result = await prisma.doctorSchedule.create({
        data: {
            ...payload
        }
    })

    return result
}






export const scheduleService = {
    createSchedule, updateSchedule, deleteSchedule, getScheduleById, getAllSchedule
}