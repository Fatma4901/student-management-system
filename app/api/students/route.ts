import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { Student } from "@/types";
import { verifyRequest } from "@/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [rows]: any = await db.query(`
      SELECT s.*, c.name as course_name
      FROM students s
      LEFT JOIN courses c ON s.course_id = c.id
      ORDER BY s.created_at DESC
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, phone, course_id }: Omit<Student, 'id' | 'created_at'> = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "INSERT INTO students (name, email, phone, course_id) VALUES (?, ?, ?, ?)",
      [name, email, phone || null, course_id || null]
    );

    return NextResponse.json({
      success: true,
      message: "Student created successfully",
      data: { id: result.insertId, name, email, phone, course_id }
    });
  } catch (error: any) {
    console.error("Create student error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, name, email, phone, course_id }: Student = await req.json();

    if (!id || !name || !email) {
      return NextResponse.json(
        { success: false, message: "ID, name and email are required" },
        { status: 400 }
      );
    }

    await db.query(
      "UPDATE students SET name = ?, email = ?, phone = ?, course_id = ? WHERE id = ?",
      [name, email, phone || null, course_id || null, id]
    );

    return NextResponse.json({
      success: true,
      message: "Student updated successfully"
    });
  } catch (error: any) {
    console.error("Update student error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM students WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete student" },
      { status: 500 }
    );
  }
}