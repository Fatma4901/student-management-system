import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Get real counts from DB
    const [studentCountRow]: any = await db.query("SELECT COUNT(*) as count FROM students");
    const [courseCountRow]: any = await db.query("SELECT COUNT(*) as count FROM courses");
    const [marksCountRow]: any = await db.query("SELECT COUNT(*) as count FROM marks");

    // 2. Get 3 sample courses for the landing page
    const [courses]: any = await db.query("SELECT * FROM courses LIMIT 3");

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          students: studentCountRow[0].count,
          courses: courseCountRow[0].count,
          marks: marksCountRow[0].count
        },
        featuredCourses: courses
      }
    });
  } catch (error) {
    console.error("Public stats error:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
