import express, { Application } from "express";
import { indexRoutes } from "./app/routes";
import { notFound } from "./app/middleware/notFoud";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import auth from "./app/lib/auth";
import path from "node:path";
import cors from 'cors';
import { envVars } from "./app/config/env";
import qs from 'qs';



const app: Application = express();
// The port your express server will be running on.


app.set("query parser", (str: string) => qs.parse(str))
app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), `src/app/templates`))


app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))



app.use("/api/auth", toNodeHandler(auth))

// Enable URL-encoded form data parsing

// Middleware to parse JSON bodies
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Basic route

app.use("/api/v1", indexRoutes)


app.use(globalErrorHandler)



app.use(notFound)


export default app