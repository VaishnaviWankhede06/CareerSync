
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin:[
        "http://localhost:5173",
        "https://career-sync-gamma-seven.vercel.app",
      ],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie ?? "";

      const token = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="))
        ?.slice("token=".length);

      if (!token || !process.env.SECRET_KEY) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        decodeURIComponent(token),
        process.env.SECRET_KEY
      );

      if (typeof decoded === "string" || !("userId" in decoded)) {
        return next(new Error("Invalid token"));
      }

      const user = await User.findById(decoded.userId).select("_id role");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.data.userId = user._id.toString();
      socket.join(`user:${user._id.toString()}`);

      next();
    } catch {
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Authenticated socket connected:", socket.data.userId);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.data.userId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

export const emitNotification = (
  userId: string,
  notification: unknown
) => {
  getIO().to(`user:${userId}`).emit("notification:new", notification);
};
