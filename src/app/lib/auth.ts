import { betterAuth, } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";


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
            type: "boolean",
            required: false,
            defaultValue: null
        },

        needPasswordChange: {
            type: "boolean",
            required: true,
            default: false
        }






    },


    // trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5000"],

    // advanced: {
    //     disableCSRFCheck: true
    // }

});



export default auth