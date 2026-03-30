import db from "@/lib/db";
import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("➡️ [LOGIN] Request for:", email);

    console.log("🔍 [LOGIN] Connecting to DB...");
    const [rows]: any = await db.query(
      "SELECT * FROM admin WHERE email=?",
      [email]
    );
    console.log("✅ [LOGIN] Query complete, rows found:", rows.length);

    if (rows.length === 0) {
      console.warn("⚠️ [LOGIN] User not found:", email);
      return NextResponse.json(
        { message: "User not found with this email" },
        { status: 401 }
      );
    }

    console.log("🔐 [LOGIN] Comparing passwords...");
    const isValidPassword = await bcrypt.compare(password, rows[0].password);
    console.log("✅ [LOGIN] Password valid:", isValidPassword);

    if (!isValidPassword) {
      console.warn("⚠️ [LOGIN] Invalid password for:", email);
      return NextResponse.json(
        { message: "Please enter correct password" },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: rows[0].id,
      email: rows[0].email,
    });

    const response = NextResponse.json({
      token,
      message: "Login successful",
    });

    // Set HTTP-only cookie for security
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    console.log("🎉 [LOGIN] Success!");
    return response;

  } catch (error: any) {
    console.error("🔥 [LOGIN ERROR]:", error.message);
    return NextResponse.json(
      { 
        message: "Server error", 
        error: error.message,
        hint: "Check your DATABASE_URL on Vercel"
      },
      { status: 500 }
    );
  }
}