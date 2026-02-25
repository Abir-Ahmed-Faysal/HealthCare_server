import express, { Application } from "express";
import { indexRoutes } from "./app/routes";
import { notFound } from "./app/middleware/notFoud";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import auth from "./app/lib/auth";
import path from "node:path";



const app: Application = express();
// The port your express server will be running on.

app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), `src/app/templates`))

app.use("/api/auth/*splat", toNodeHandler(auth))

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(cookieParser())
app.use(express.json());


// Basic route

app.use("/api/v1", indexRoutes)



app.use(globalErrorHandler)



app.use(notFound)


export default app