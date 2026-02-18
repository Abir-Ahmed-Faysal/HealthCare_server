import { Request, Response } from "express";
import app from "./app";



const BootStrap = async () => {
  try {

    app.get('/', (req: Request, res: Response) => {
      res.send('Hello, TypeScript + Express!');
    });


    // Start the server
    app.listen(5000, () => {
      console.log(`Server is running on http://localhost:5000`);
    });

  } catch (error) {
    console.log("server error", error);
  }
}


BootStrap()




