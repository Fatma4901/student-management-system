import db from "@/lib/db";
import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("➡️ [LOGIN] Request for:", email);

    console.log("🔍 [LOGIN] Connecting to DB...");
    // STEP 1: Check admin table
    let [rows]: any = await db.query(
      "SELECT * FROM admin WHERE email=?",
      [email]
    );

    let role = 'admin';
    let userRow = rows[0];

    // STEP 2: If no admin found, check students table
    if (rows.length === 0) {
      console.log("🔍 [LOGIN] Checking student table...");
      [rows] = await db.query(
        "SELECT * FROM students WHERE email=?",
        [email]
      );
      
      if (rows.length > 0) {
        role = 'student';
        userRow = rows[0];
      }
    }

    console.log("✅ [LOGIN] Query complete, user found in role:", role);

    if (rows.length === 0) {
      console.warn("⚠️ [LOGIN] User not found:", email);
      return NextResponse.json(
        { message: "User not found with this email" },
        { status: 401 }
      );
    }

    // STEP 3: Validate password (students must also have a password now)
    console.log("🔐 [LOGIN] Comparing passwords...");
    const isValidPassword = await bcrypt.compare(password, userRow.password);
    console.log("✅ [LOGIN] Password valid:", isValidPassword);

    if (!isValidPassword) {
      console.warn("⚠️ [LOGIN] Invalid password for:", email);
      return NextResponse.json(
        { message: "Please enter correct password" },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: userRow.id,
      email: userRow.email,
      role: userRow.role || role,
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