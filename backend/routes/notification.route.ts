
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  getMyNotifications,
  markNotificationRead,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/", isAuthenticated, getMyNotifications);
router.patch("/:id/read", isAuthenticated, markNotificationRead);

export default router;
