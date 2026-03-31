import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // 1. Check if email already exists in students table
    const [existing]: any = await db.query(
      "SELECT id FROM students WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email already exists in institutional database" },
        { status: 400 }
      );
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert student securely
    // We explicitly provide NULL for phone and course_id to avoid "Field doesn't have a default value" errors
    await db.query(
      "INSERT INTO students (name, email, password, role, phone, course_id) VALUES (?, ?, ?, 'student', NULL, NULL)",
      [name, email, hashedPassword]
    );

    return NextResponse.json({
      success: true,
      message: "Academic identity initialized successfully",
    });

  } catch (error: any) {
    console.error("Student Signup ERROR:", error);
    return NextResponse.json(
      { message: "Server error during registration", error: error.message },
      { status: 500 }
    );
  }
}
