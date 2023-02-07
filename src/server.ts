import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { userRouter } from "./controllers/user.routes";
import { posterRouter } from "./controllers/poster.routes";
import { comntRouter } from "./controllers/comnt.routes";
 
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const app = express();
 
const  ATLAS_URI  = process.env.ATLAS_URI;
 
if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}
 
connectToDatabase(ATLAS_URI)
   .then(() => {
       
       app.use(cors());

       app.use("/users", userRouter);
       app.use("/posters", posterRouter);
       app.use("/comnts", comntRouter);
 
       
       // start the Express server
       app.listen(5300, () => {
           console.log(`Server running at http://localhost:5300...`);
       });
 
   })
   .catch(error => console.error(error));

export {app}