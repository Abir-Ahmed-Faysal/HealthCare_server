import express, { Application } from "express";
import { indexRoutes } from "./app/routes";
import { notFound } from "./app/middleware/notFoud";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";



const app: Application = express();
// The port your express server will be running on.

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