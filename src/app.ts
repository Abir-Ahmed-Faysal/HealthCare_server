import express, { Application } from "express";
import { indexRoutes } from "./app/routes";



const app: Application = express();
// The port your express server will be running on.

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());


// Basic route

app.use("/api/v1",indexRoutes )


export default app