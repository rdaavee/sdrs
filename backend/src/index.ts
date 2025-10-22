import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";

import RequestRoutes from "./routes/request.routes";
import VerifyRoutes from "./routes/verify.routes";
import AdminRoutes from "./routes/admin.routes";
import PaymentRoutes from "./routes/payment.routes";
import DocumentRoutes from "./routes/document.routes";

import { app, server } from "./socket/socket";

const port = Number(process.env.API_PORT);
const MONGODB_CONNECTION: any = process.env.MONGODB_CONNECTION;

mongoose
    .connect(MONGODB_CONNECTION)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Internal Server Error");
    });

// Allow specific origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://student-document-request-system-2.onrender.com",
].filter(Boolean);

app.set("trust proxy", 1);
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Add this proxy route (for future Render frontend HTTPS proxying)
app.use(
    "/api",
    createProxyMiddleware({
        target: "http://13.214.216.27:3000", // your EC2 backend itself
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
    })
);

// Main API routes
app.use("/request", RequestRoutes);
app.use("/verify", VerifyRoutes);
app.use("/admin", AdminRoutes);
app.use("/payments", PaymentRoutes);
app.use("/documents", DocumentRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from your Node.js Express server!");
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
