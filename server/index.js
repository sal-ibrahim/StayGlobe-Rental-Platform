import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
dotenv.config();

const app = express();

//specify the port and fallback
const PORT = process.env.PORT || 3000;


//setup to make server run
app.use(express.json());
app.use(cookieParser());
app.use(cors());


//run server
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`)
})

//connect the user route
app.use("/api/user", userRoute)

//
app.use("/api/residency", residencyRoute)