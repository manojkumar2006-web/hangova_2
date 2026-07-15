import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import OTP from "@/models/OTP";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing email or OTP" }, { status: 400 });
    }

    await dbConnect();

    // Check if OTP exists and matches
    const record = await OTP.findOne({ email });

    if (!record) {
      return NextResponse.json({ error: "OTP expired or not found. Please request a new one." }, { status: 400 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    // OTP is valid, mark user as verified
    await User.findOneAndUpdate({ email }, { isVerified: true });

    // Delete the OTP record so it can't be reused
    await OTP.deleteOne({ email });

    // In a real app, you might issue a JWT here or create a session.
    // For now, we return success so the frontend can log them in.
    return NextResponse.json({ success: true, message: "Email verified successfully" });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
