import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Fetch limited admin data for public display (No passwords!)
    const [rows]: any = await db.query("SELECT id, email FROM admin");
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Public admins error:", error);
    return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 500 });
  }
}
