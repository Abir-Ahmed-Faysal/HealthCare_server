import { betterAuth, } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";


// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },

    user: {
        additionalFields: {


        needPasswordChange: {
            type: "boolean",
            required: true,
            default: false
        }
,

            role: {
                type: "string",
                required: true, defaultValue: Role.PATIENT
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false
            }
        },
        deletedAt: {
            type: "date",
            required: false,
            defaultValue: null
        },





    },


    trustedOrigins: [envVars.FRONTEND_URL || "http://localhost:5000"],

    advanced: {
        disableCSRFCheck: true
    }

});



export default auth