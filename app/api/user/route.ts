import prisma from "@/prisma/client";
import { hash } from "bcrypt";
import * as z from "zod";

const { NextResponse } = require("next/server");

// define schema for input verification
const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body: { email: string; username: string; password: string } =
      await req.json();
    const { email, username, password } = userSchema.parse(body);

    //check if email already exist
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "user with this email already exist" },
        { status: 409 }
      );
    }

    //check if username already exist
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "user with this username already exist" },
        { status: 409 }
      );
    }

    //create new user in firebase
    const hashPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json({
      user: rest,
      message: "User created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 },
      error
    );
  }
}
