
import { Request, Response } from "express";
import { Notification } from "../models/notification.model";

// export const getMyNotifications = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const userId = req.headers["userId"] as string;

//     const notifications = await Notification.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     const unreadCount = await Notification.countDocuments({
//       user: userId,
//       isRead: false,
//     });

//     return res.status(200).json({
//       success: true,
//       notifications,
//       unreadCount,
//     });
//   } catch (error) {
//     console.error("getMyNotifications error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch notifications",
//     });
//   }
// };


export const getMyNotifications = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.headers["userId"] as string;

    const notifications = await Notification.find({ user: userId })
      .populate({
        path: "application",
        populate: {
          path: "job",
          select: "title company",
          populate: {
            path: "company",
            select: "name",
          },
        },
      })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("getMyNotifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch notifications",
    });
  }
};

export const markNotificationRead = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.headers["userId"] as string;

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("markNotificationRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update notification",
    });
  }
};
