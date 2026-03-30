// import db from "@/lib/db";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Check if email already exists
//     const [existing]: any = await db.query(
//       "SELECT id FROM admin WHERE email = ?",
//       [email]
//     );

//     if (existing.length > 0) {
//       return NextResponse.json(
//         { message: "Email already exists" },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       "INSERT INTO admin (email, password) VALUES (?, ?)",
//       [email, hashedPassword]
//     );

//     return NextResponse.json({
//       message: "Signup successful",
//     });

//   } catch (error: any) {
//     console.error("Signup ERROR:", error);
//     return NextResponse.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log("➡️ [POST /signup] Request received");

  try {
    // STEP 1: Parse body
    let body;
    try {
      body = await req.json();
      console.log("📦 Body parsed:", body);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      throw new Error("Invalid JSON body");
    }

    const { email, password } = body;

    // STEP 2: Validate input
    if (!email || !password) {
      console.warn("⚠️ Validation failed:", { email, password });
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // STEP 3: DB connection test
    console.log("🔌 Testing DB connection...");
    try {
      await db.query("SELECT 1");
      console.log("✅ DB connected");
    } catch (dbErr) {
      console.error("🔥 DB CONNECTION ERROR:", dbErr);
      throw new Error("Database connection failed");
    }

    // STEP 4: Check existing user
    console.log("🔍 Checking existing user:", email);

    let existing;
    try {
      const result: any = await db.query(
        "SELECT id FROM admin WHERE email = ?",
        [email]
      );
      existing = result[0];
      console.log("📊 Query result:", result);
    } catch (queryErr) {
      console.error("🔥 SELECT QUERY ERROR:", queryErr);
      throw new Error("Failed to check existing user");
    }

    if (existing.length > 0) {
      console.warn("❌ Email already exists:", email);
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // STEP 5: Hash password
    let hashedPassword;
    try {
      console.log("🔐 Hashing password...");
      hashedPassword = await bcrypt.hash(password, 10);
      console.log("✅ Password hashed");
    } catch (hashErr) {
      console.error("🔥 HASH ERROR:", hashErr);
      throw new Error("Password hashing failed");
    }

    // STEP 6: Insert user
    try {
      console.log("💾 Inserting user...");
      const insertResult = await db.query(
        "INSERT INTO admin (email, password) VALUES (?, ?)",
        [email, hashedPassword]
      );
      console.log("✅ Insert success:", insertResult);
    } catch (insertErr) {
      console.error("🔥 INSERT ERROR:", insertErr);
      throw new Error("Insert failed");
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️ Completed in ${duration}ms`);

    return NextResponse.json({
      message: "Signup successful",
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;

    console.error("🔥 FINAL ERROR:", {
      message: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
    });

    return NextResponse.json(
      {
        message: "Server error",
        debug: error.message, // helpful during development
      },
      { status: 500 }
    );
  }
}
