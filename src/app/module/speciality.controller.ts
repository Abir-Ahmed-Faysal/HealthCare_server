import { NextFunction, Request, Response } from "express";
import { specialtyService } from "./specialty.service";

const  getAllSpecialty= async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await specialtyService.getAllSpecialty()

        if (!result) {
            return res.status(400).json({ success: false, message: "failed to create new specialty" })
        }
        return res.status(200).json({ success: true, message: "successfully true", data: result })
    } catch (error) {
        console.log(error);
        next(error)
    }
}







const createSpecialty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const result = await specialtyService.createSpecialty(payload)

        if (!result) {
            return res.status(400).json({ success: false, message: "failed to create new specialty" })
        }
        return res.status(201).json({ success: true, message: "successfully true", data: result })
    } catch (error) {
        next(error)
    }
}


const updateSpecialty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const result = await specialtyService.updateSpecialty(id as string,payload)

        if (!result) {
            return res.status(400).json({ success: false, message: "failed to create new specialty" })
        }
        return res.status(200).json({ success: true, message: "successfully true", data: result })
    } catch (error) {
        next(error)
    }
}


const deleteSpecialty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const result = await specialtyService.deleteSpecialty(id as string)

        if (!result) {
            return res.status(400).json({ success: false, message: "failed to create new specialty" })
        }
        return res.status(200).json({ success: true, message: "successfully true", data: result })
    } catch (error) {
        next(error)
    }
}




export const specialtyController = {
    createSpecialty,getAllSpecialty,updateSpecialty ,deleteSpecialty
}