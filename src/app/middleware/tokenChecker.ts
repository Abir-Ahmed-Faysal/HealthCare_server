import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtUtils } from "../utilities/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";



export const authTokenChecker = (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         success: false,
         message: "You are not authorized to access this route"
      });
   }

   const token = authHeader.split(" ")[1];

   const decoded = jwtUtils.verifyToken(token, envVars.ACCESS_TOKEN_SECRET);

   if (!decoded.success) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         success: false,
         message: "Invalid token"
      });
   }

   const payload = decoded.data as JwtPayload;

       if (payload.role !== Role.SUPER_ADMIN) {
        res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "You are not authorized to access this route" });
    }


   req.user = payload;

   next();
};