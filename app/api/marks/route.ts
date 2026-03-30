import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { Mark } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const query = `
      SELECT m.*, s.name as student_name, s.email as student_email, c.name as course_name
      FROM marks m
      JOIN students s ON m.student_id = s.id
      JOIN courses c ON m.course_id = c.id
      ORDER BY m.created_at DESC
    `;

    const [rows]: any = await db.query(query);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get marks error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch marks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body: any = await req.json();

    // Check if body is an array or single object
    const marksData = Array.isArray(body) ? body : [body];

    if (marksData.length === 0) {
      return NextResponse.json({ success: false, message: "No marks data provided" }, { status: 400 });
    }

    // Insert all subjects for the student
    for (const entry of marksData) {
      if (!entry.student_id || !entry.course_id || entry.marks === undefined) {
        return NextResponse.json({ success: false, message: "Some data fields are missing" }, { status: 400 });
      }
      
      const mVal = parseInt(entry.marks);
      if (isNaN(mVal) || mVal < 0 || mVal > 100) {
        return NextResponse.json({ success: false, message: "Valid marks are required (0-100)" }, { status: 400 });
      }

      await db.query(
        "INSERT INTO marks (student_id, course_id, marks) VALUES (?, ?, ?)",
        [entry.student_id, entry.course_id, mVal]
      );
    }

    return NextResponse.json({ success: true, message: "Marks saved successfully" });
  } catch (error: any) {
    console.error("Create marks error:", error);
    return NextResponse.json({ success: false, message: "Failed to add marks" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id, student_id, course_id, marks }: any = await req.json();

    if (!id || !student_id || !course_id || marks === undefined) {
      return NextResponse.json({ success: false, message: "ID, student, course, and marks are required" }, { status: 400 });
    }

    if (marks < 0 || marks > 100) {
      return NextResponse.json({ success: false, message: "Marks must be between 0 and 100" }, { status: 400 });
    }

    await db.query(
      "UPDATE marks SET student_id = ?, course_id = ?, marks = ? WHERE id = ?",
      [student_id, course_id, marks, id]
    );

    return NextResponse.json({ success: true, message: "Marks updated successfully" });
  } catch (error: any) {
    console.error("Update marks error:", error);
    return NextResponse.json({ success: false, message: "Failed to update marks" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, message: "Marks ID is required" }, { status: 400 });

    await db.query("DELETE FROM marks WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Marks deleted successfully" });
  } catch (error) {
    console.error("Delete marks error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete marks" }, { status: 500 });
  }
}