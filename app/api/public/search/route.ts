import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: "Please provide an email" }, { status: 400 });
    }

    // 1. Fetch Student Details
    const [studentRows]: any = await db.query(
      "SELECT s.*, c.name as enrolled_course FROM students s LEFT JOIN courses c ON s.course_id = c.id WHERE s.email = ?",
      [email]
    );

    if (studentRows.length === 0) {
      return NextResponse.json({ success: false, message: "No student found with this email" }, { status: 404 });
    }

    const student = studentRows[0];

    // 2. Fetch all marks for this student
    const [marksRows]: any = await db.query(
      `SELECT m.*, c.name as subject_name 
       FROM marks m 
       JOIN courses c ON m.course_id = c.id 
       WHERE m.student_id = ?`,
      [student.id]
    );

    return NextResponse.json({
      success: true,
      data: {
        student,
        marks: marksRows
      }
    });
  } catch (error) {
    console.error("Public search error:", error);
    return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 500 });
  }
}
