// import { Application } from "../models/application.model";
// import { Job } from "../models/job.model";
// import { Request, Response } from "express";
// import { User } from "../models/user.model";
// import { Notification } from "../models/notification.model";
// import { emitNotification } from "../utils/socket";
// import { sendApplicationDecisionEmail } from "../utils/email";

// interface RequestWithId extends Request {
//   id?: string;
// }

// export const applyJob = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const userId = req.cookies.userId;
//     const jobId = req.params.id;
//     if (!jobId) {
//       return res.status(400).json({
//         message: "Job id is required.",
//         success: false,
//       });
//     }
//     // check if the user has already applied for the job
//     const existingApplication = await Application.findOne({
//       job: jobId,
//       applicant: userId,
//     });

//     if (existingApplication) {
//       return res.status(400).json({
//         message: "You have already applied for this jobs",
//         success: false,
//       });
//     }

//     // check if the jobs exists
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({
//         message: "Job not found",
//         success: false,
//       });
//     }
//     // create a new application
//     const newApplication = await Application.create({
//       job: jobId,
//       applicant: userId,
//     });

//     job.applications.push(newApplication._id);
//     await job.save();
//     return res.status(201).json({
//       message: "Job applied successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const getAppliedJobs = async (
//   req: RequestWithId,
//   res: Response
// ): Promise<any> => {
//   try {
//     const userId = req.cookies.userId;
//     const application = await Application.find({ applicant: userId })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "job",
//         options: { sort: { createdAt: -1 } },
//         populate: {
//           path: "company",
//           options: { sort: { createdAt: -1 } },
//         },
//       });
//     if (!application) {
//       return res.status(404).json({
//         message: "No Applications",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       application,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getApplicants = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const jobId = req.params.id;
//     const job = await Job.findById(jobId).populate({
//       path: "applications",
//       options: { sort: { createdAt: -1 } },
//       populate: {
//         path: "applicant",
//       },
//     });
//     if (!job) {
//       return res.status(404).json({
//         message: "Job not found.",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       job,
//       succees: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// // export const updateStatus = async (
// //   req: Request,
// //   res: Response
// // ): Promise<any> => {
// //   try {
// //     const { status } = req.body;
// //     const applicationId = req.params.id;
// //     if (!status) {
// //       return res.status(400).json({
// //         message: "status is required",
// //         success: false,
// //       });
// //     }

// //     const application = await Application.findOne({ _id: applicationId });
// //     if (!application) {
// //       return res.status(404).json({
// //         message: "Application not found.",
// //         success: false,
// //       });
// //     }

// //     // update the status
// //     application.status = status.toLowerCase();
// //     await application.save();

// //     return res.status(200).json({
// //       message: "Status updated successfully.",
// //       success: true,
// //     });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // };




// export const updateStatus = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const recruiterId = req.headers["userId"] as string;
//     const { status } = req.body;
//     const applicationId = req.params.id;

//     if (!recruiterId) {
//       return res.status(401).json({
//         message: "Authentication required",
//         success: false,
//       });
//     }

//     if (!["accepted", "rejected"].includes(status)) {
//       return res.status(400).json({
//         message: "Status must be accepted or rejected",
//         success: false,
//       });
//     }

//     const recruiter = await User.findById(recruiterId);

//     if (!recruiter || recruiter.role !== "recruiter") {
//       return res.status(403).json({
//         message: "Only recruiters can update application status",
//         success: false,
//       });
//     }

//     const application: any = await Application.findById(applicationId)
//       .populate("job")
//       .populate("applicant");

//     if (!application || !application.job || !application.applicant) {
//       return res.status(404).json({
//         message: "Application, job, or applicant not found",
//         success: false,
//       });
//     }

//     const job = application.job;
//     const student = application.applicant;

//     // Only the recruiter who created this job can update its applications.
//     if (job.created_by.toString() !== recruiterId) {
//       return res.status(403).json({
//         message: "You cannot update applications for this job",
//         success: false,
//       });
//     }

//     // Avoid duplicate notifications and emails for the same decision.
//     if (application.status === status) {
//       return res.status(200).json({
//         message: `Application is already ${status}`,
//         success: true,
//       });
//     }

//     // Persist the application decision first.
//     application.status = status;
//     await application.save();

//     const title =
//       status === "accepted"
//         ? "Application Accepted"
//         : "Application Update";

//     const message =
//       status === "accepted"
//         ? `Congratulations! Your application for ${job.title} has been accepted. The recruitment team will share the next steps.`
//         : `Thank you for applying for ${job.title}. Unfortunately, your application was not selected for the next stage.`;

//     // Save notification so the student can see it later too.
//     const notification = await Notification.create({
//       user: student._id,
//       application: application._id,
//       title,
//       message,
//       type: status,
//     });

//     // Send the notification immediately to the student's socket room.
//     try {
//       emitNotification(student._id.toString(), notification);
//     } catch (socketError) {
//       // Database notification is already saved; do not undo the decision.
//       console.error("Socket notification failed:", socketError);
//     }

//     // Email failure must not undo the application decision.
//     try {
//       await sendApplicationDecisionEmail({
//         to: student.email,
//         studentName: student.fullname,
//         jobTitle: job.title,
//         status,
//       });
//     } catch (emailError) {
//       console.error("Application decision email failed:", emailError);
//     }

//     return res.status(200).json({
//       message: `Application ${status} successfully`,
//       success: true,
//       notification,
//     });
//   } catch (error) {
//     console.error("updateStatus error:", error);

//     return res.status(500).json({
//       message: "Unable to update application status",
//       success: false,
//     });
//   }
// };




import { Application } from "../models/application.model";
import { Job } from "../models/job.model";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Notification } from "../models/notification.model";
import { emitNotification } from "../utils/socket";
import { sendApplicationDecisionEmail } from "../utils/email";

interface RequestWithId extends Request {
  id?: string;
}

// Apply for a job
export const applyJob = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.cookies.userId;
    const jobId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.error("applyJob error:", error);

    return res.status(500).json({
      message: "Unable to apply for job",
      success: false,
    });
  }
};

// Get jobs applied for by the logged-in student
export const getAppliedJobs = async (
  req: RequestWithId,
  res: Response
): Promise<any> => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const applications = await Application.find({
      applicant: userId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    return res.status(200).json({
      application: applications,
      success: true,
    });
  } catch (error) {
    console.error("getAppliedJobs error:", error);

    return res.status(500).json({
      message: "Unable to fetch applications",
      success: false,
    });
  }
};

// Get applicants for a job
export const getApplicants = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("getApplicants error:", error);

    return res.status(500).json({
      message: "Unable to fetch applicants",
      success: false,
    });
  }
};

// Update application status and notify the student
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("🔥 updateStatus controller HIT");
    console.log("Request body:", req.body);
    console.log("Application ID:", req.params.id);

    const recruiterId = req.headers["userId"] as string;
    const applicationId = req.params.id;
    const rawStatus: unknown = req.body.status;

    if (!recruiterId) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    if (typeof rawStatus !== "string") {
      return res.status(400).json({
        message: "Status must be accepted or rejected",
        success: false,
      });
    }

    const normalizedStatus = rawStatus.toLowerCase();

    if (
      normalizedStatus !== "accepted" &&
      normalizedStatus !== "rejected"
    ) {
      return res.status(400).json({
        message: "Status must be accepted or rejected",
        success: false,
      });
    }

    // Explicit union type fixes the TypeScript compilation error.
    const status: "accepted" | "rejected" = normalizedStatus;

    console.log("Normalized status:", status);

    const recruiter = await User.findById(recruiterId);

    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can update application status",
        success: false,
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (
      !application ||
      !application.job ||
      !application.applicant
    ) {
      return res.status(404).json({
        message: "Application, job, or applicant not found",
        success: false,
      });
    }

    // These populated fields are treated as their corresponding documents.
    const job = application.job as any;
    const student = application.applicant as any;

    if (job.created_by.toString() !== recruiterId) {
      return res.status(403).json({
        message: "You cannot update applications for this job",
        success: false,
      });
    }

    // Do not create duplicate notifications for the same decision.
    if (application.status === status) {
      return res.status(200).json({
        message: `Application is already ${status}`,
        success: true,
      });
    }

    // Save the application decision first.
    application.status = status;
    await application.save();

    console.log("Application status saved:", status);

    const title =
      status === "accepted"
        ? "Application Accepted"
        : "Application Update";

    const message =
      status === "accepted"
        ? `Congratulations! Your application for ${job.title} has been accepted. The recruitment team will share the next steps.`
        : `Thank you for applying for ${job.title}. Unfortunately, your application was not selected for the next stage.`;

    // Persist the notification in MongoDB.
    console.log("Creating notification for student:", {
      studentId: student._id.toString(),
      email: student.email,
      status,
    });

    const notification = await Notification.create({
      user: student._id,
      application: application._id,
      title,
      message,
      type: status,
    });

    console.log(
      "Notification saved:",
      notification._id.toString()
    );

    // Send real-time notification to the student's socket room.
    try {
      emitNotification(student._id.toString(), notification);
      console.log("Socket notification emitted to:", student._id.toString());
    } catch (socketError) {
      console.error("Socket notification failed:", socketError);
    }

    // Email failure should not undo the saved decision.
    try {
      await sendApplicationDecisionEmail({
        to: student.email,
        studentName: student.fullname,
        jobTitle: job.title,
        status,
      });

      console.log("Application decision email sent");
    } catch (emailError) {
      console.error("Application decision email failed:", emailError);
    }

    return res.status(200).json({
      message: `Application ${status} successfully`,
      success: true,
      notification,
    });
  } catch (error) {
    console.error("updateStatus error:", error);

    return res.status(500).json({
      message: "Unable to update application status",
      success: false,
    });
  }
};
