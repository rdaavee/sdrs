import dotenv from "dotenv";
dotenv.config()

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';

import RequestRoutes from "./routes/request.routes"
import VerifyRoutes from "./routes/verify.routes"
import AdminRoutes from "./routes/admin.routes"
import { app , server } from './socket/socket' 

const port = Number(process.env.API_PORT);

const MONGODB_CONNECTION: any = process.env.MONGODB_CONNECTION;

mongoose
    .connect(MONGODB_CONNECTION)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('Internal Server Error');
    });

app.set('trust proxy', 1);
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/request", RequestRoutes)
app.use("/verify", VerifyRoutes)
app.use("/admin", AdminRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from your Node.js Express server!');
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});