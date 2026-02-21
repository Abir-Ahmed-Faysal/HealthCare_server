import { betterAuth, } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { StringValue }from "ms";
import { toSeconds } from "../utilities/duration";






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
    }, session: {
        expiresIn:toSeconds(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue  ),
        updateAge: toSeconds(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as  StringValue ),
        cookieCache: {
            enabled: true,
            maxAge: toSeconds(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as  StringValue)/1000
        }
    },


    trustedOrigins: [envVars.FRONTEND_URL || "http://localhost:5000"],

    advanced: {
        disableCSRFCheck: true
    }

});



export default auth