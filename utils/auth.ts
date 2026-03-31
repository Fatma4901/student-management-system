import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || "mysecret";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

export function generateToken(payload: AuthUser) {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  // Try to get from Authorization header first
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Try to get from cookies
  return req.cookies.get("token")?.value;
}

export function verifyRequest(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  return verifyToken(token);
}