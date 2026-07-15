import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import OTP from "@/models/OTP";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ error: "Email already registered and verified." }, { status: 400 });
      }
      // If user exists but not verified, we can just resend OTP
      // Or update their password if they passed one. We'll update the password and username.
      existingUser.username = username || existingUser.username;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();
    } else {
      // Create new unverified user
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: username || email.split("@")[0],
        email,
        password: hashedPassword,
        isVerified: false,
      });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await OTP.findOneAndDelete({ email }); // Delete any existing OTP for this email
    await OTP.create({ email, otp: otpCode });

    // Setup Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Hangova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Hangova Verification Code",
      text: `Welcome to Hangova! Your verification code is: ${otpCode}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #05040a; color: #fff; border-radius: 12px;">
          <h2 style="color: #a78bfa;">Welcome to Hangova 🚀</h2>
          <p style="color: #cbd5e1;">Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #ec4899;">${otpCode}</h1>
          <p style="color: #cbd5e1;">Enter this code to join the gang. It expires in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully"
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
