import db from "@/lib/db";
import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [rows]: any = await db.query(
      "SELECT * FROM admin WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "User not found with this email" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, rows[0].password);

    if (!isValidPassword) {
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
  secure: false, // 🔥 IMPORTANT for localhost
  sameSite: "lax", // 🔥 change from strict
  path: "/", // 🔥 IMPORTANT
  maxAge: 60 * 60 * 24,
});
    return response;

  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}