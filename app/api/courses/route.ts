import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { Course } from "@/types";
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

    const [rows]: any = await db.query(
      "SELECT * FROM courses ORDER BY name ASC"
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses" },
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

    const { name, description }: Omit<Course, 'id' | 'created_at'> = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Course name is required" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "INSERT INTO courses (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    return NextResponse.json({
      success: true,
      message: "Course created successfully",
      data: { id: result.insertId, name, description }
    });
  } catch (error: any) {
    console.error("Create course error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "Course name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to create course" },
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

    const { id, name, description }: Course = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, message: "ID and name are required" },
        { status: 400 }
      );
    }

    await db.query(
      "UPDATE courses SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    return NextResponse.json({
      success: true,
      message: "Course updated successfully"
    });
  } catch (error: any) {
    console.error("Update course error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "Course name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to update course" },
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
        { success: false, message: "Course ID is required" },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM courses WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete course" },
      { status: 500 }
    );
  }
}