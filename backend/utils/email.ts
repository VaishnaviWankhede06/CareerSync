// EMAIL_USER=your_email@gmail.com
// EMAIL_PASS=your_16_character_app_password




import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface DecisionEmail {
  to: string;
  studentName: string;
  jobTitle: string;
  status: "accepted" | "rejected";
}

export const sendApplicationDecisionEmail = async ({
  to,
  studentName,
  jobTitle,
  status,
}: DecisionEmail) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not configured");
  }

  const accepted = status === "accepted";

  const subject = accepted
    ? `Application Update: ${jobTitle}`
    : `Update on Your Application: ${jobTitle}`;

  const text = accepted
    ? `Hi ${studentName},

Congratulations! Your application for ${jobTitle} has been accepted for the next stage.

The recruitment team will share the next steps and interview details separately. Please keep checking your email and CareerSync dashboard.

Regards,
CareerSync Team`
    : `Hi ${studentName},

Thank you for applying for ${jobTitle} through CareerSync.

After reviewing your application, the recruitment team has decided not to move forward with your application at this time.

We appreciate your interest and wish you success in your job search.

Regards,
CareerSync Team`;

  const result = await transporter.sendMail({
    from: `"CareerSync" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  return result;
};
