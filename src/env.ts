import dotenv from 'dotenv';
dotenv.config();



interface EnvConfig {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    FRONTEND_URL: string
}



const loadEnvVariable = (): EnvConfig => {

    const requiredEnvVariables = ['NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'FRONTEND_URL',
        'BETTER_AUTH_URL',
        'BETTER_AUTH_SECRET']

    requiredEnvVariables.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable ${envVar} is required but on set in .env file.`)
        }
    })


    return {
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    }
}


export const envVars = loadEnvVariable()