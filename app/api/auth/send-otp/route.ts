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

    // Setup Ethereal Email (Fake SMTP for testing)
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Hangova Security" <security@hangova.com>',
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

    console.log("OTP Email Sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      // We pass back the preview URL just so the frontend can show it in Dev mode
      previewUrl: nodemailer.getTestMessageUrl(info)
    });

  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
