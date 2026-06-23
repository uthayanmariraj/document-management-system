import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
    
    // if (password.length < 8) {
    //   return NextResponse.json(
    //     { message: "Password must be at least 8 characters long." },
    //     { status: 400 }
    //   );
    // }

    const exists = await db.user.findUnique({
      where: { email },
    });
    
    if (exists) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });
    
    return NextResponse.json(
      { message: "User registered successfully!", userId: newUser.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { message: "An error occurred on the server." },
      { status: 500 }
    );
  }
}