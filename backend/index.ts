import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import userRoute from "./routes/user.route";
import companyRoute from "./routes/company.route";
import jobRoute from "./routes/job.route";
import applicationRoute from "./routes/application.route";
import { createServer } from "http";
import { initializeSocket } from "./utils/socket";
import notificationRoute from "./routes/notification.route";

dotenv.config({});

const app = express();

const httpServer = createServer(app);

initializeSocket(httpServer);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: [
     "http://localhost:5173",

    "https://career-sync-gamma-seven.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT;

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/notifications", notificationRoute);

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server running at port ${PORT}`);
// });

httpServer.listen(PORT || 8000, () => {
  connectDB();
  console.log(`Server running at port ${PORT || 8000}`);
});

// src/index.ts
console.log("App is running!");
