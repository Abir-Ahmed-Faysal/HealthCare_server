import dotenv from 'dotenv';
import AppError from '../errorHelpers/AppError';
import { StatusCodes } from 'http-status-codes';

dotenv.config();



interface EnvConfig {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    FRONTEND_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
    SUPER_ADMIN_SECRET: string;
    SUPER_ADMIN_TOKEN_EXPIRES_IN: string;
}





const loadEnvVariable = (): EnvConfig => {

    const requiredEnvVariables = ['NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'FRONTEND_URL',
        'BETTER_AUTH_URL',
        'BETTER_AUTH_SECRET',
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SECRET',
        'ACCESS_TOKEN_EXPIRES_IN',
        'REFRESH_TOKEN_EXPIRES_IN',
        'BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN',
        'BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE',
        'SUPER_ADMIN_SECRET',
        'SUPER_ADMIN_TOKEN_EXPIRES_IN']

    requiredEnvVariables.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, `Environment variable ${envVar} is required but on set in .env file.`)
        }
    })


    return {
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        SUPER_ADMIN_SECRET: process.env.SUPER_ADMIN_SECRET as string,
        SUPER_ADMIN_TOKEN_EXPIRES_IN: process.env.SUPER_ADMIN_TOKEN_EXPIRES_IN as string,
    }
}




export const envVars = loadEnvVariable()
