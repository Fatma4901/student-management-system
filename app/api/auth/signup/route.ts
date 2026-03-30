import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {

    console.log("ENV CHECK:");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const { email, password } = await req.json();

    // Check if email already exists
    const [existing]: any = await db.query(
      "SELECT id FROM admin WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // 🔥 HASH PASSWORD (MOST IMPORTANT)
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO admin (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return NextResponse.json({
      message: "Signup successful",
    });

  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
