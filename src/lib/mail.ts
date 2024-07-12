import nodemailer from "nodemailer";

export async function getMailClient() {
  const account = await nodemailer.createTestAccount(); //MAILTRAP DO NODEMAILER

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", //FAKE SMTP SERVICE
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  return transporter;
}
