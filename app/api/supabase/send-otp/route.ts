import { NextResponse } from "next/server";
import  nodemailer  from 'nodemailer';

export async function POST(req: Request) {
  const { email } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   await db.otp.create({
//     data: { email, code: otp }
//   });


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Your Verification Code",
    html: `<h2>Your OTP: ${otp}</h2>`,
  });

  return NextResponse.json({ ok: true });
}
