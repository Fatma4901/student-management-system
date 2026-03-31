import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { Student } from "@/types";
import { verifyRequest } from "@/utils/auth";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/utils/email";

// Helper to generate a temporary verification password
function generateTempPassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars 1, l, 0, O
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export async function GET(req: NextRequest) {
  try {
    const user = verifyRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isStudent = user.role === 'student';
    let query = `
      SELECT s.*, c.name as course_name
      FROM students s
      LEFT JOIN courses c ON s.course_id = c.id
    `;

    let queryParams: any[] = [];
    if (isStudent) {
      query += ` WHERE s.id = ? `;
      queryParams.push(user.id);
    }

    query += ` ORDER BY s.created_at DESC `;

    const [rows]: any = await db.query(query, queryParams);

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

    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { name, email, phone, course_id }: Omit<Student, 'id' | 'created_at'> = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    // 🚀 STEP 1: Generate & Hash temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 🚀 STEP 2: Database Synchronization
    // We sanitize the course_id to ensure only valid Integers go to the DB
    let sanitizedCourseId = null;
    if (course_id && typeof course_id !== 'object') {
      const parsed = parseInt(course_id.toString(), 10);
      if (!isNaN(parsed)) {
        sanitizedCourseId = parsed;
      }
    }
    
    let result: any;
    try {
      [result] = await db.query(
        "INSERT INTO students (name, email, password, phone, course_id, role) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hashedPassword, phone || null, sanitizedCourseId, 'student']
      );
    } catch (sqlError: any) {
      console.error("⛔ [DB SYNC FAILED]:", sqlError.message);
      return NextResponse.json(
        { success: false, message: `Database Missing Column or Error: ${sqlError.message}` },
        { status: 500 }
      );
    }

    // ... (rest of the logic)

    // 🚀 STEP 3: Send the "Welcome" email in the background (non-blocking)
    try {
      await sendWelcomeEmail({
        toEmail: email,
        studentName: name,
        temporaryPassword: tempPassword
      });
      console.log(`✅ Welcome Email sent for student identity: ${email}`);
    } catch (emailErr) {
      console.error("⚠️ Failed to send welcome email:", emailErr);
      // We don't fail the whole registration if email delivery fails,
      // but we log it for administrative monitoring.
    }

    return NextResponse.json({
      success: true,
      message: "Student identity initialized and portal credentials dispatched.",
      data: { id: result.insertId, name, email, phone, course_id }
    });
  } catch (error: any) {
    console.error("Create student error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "Email already exists in institutional database" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        message: "Institutional Core Error: " + (error.sqlMessage || "Failed to initialize student identity"),
        debug: error.message 
      },
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

    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
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

    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
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