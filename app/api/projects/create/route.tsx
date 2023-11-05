import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body.owner, body.template);

    const currentTimestamp = new Date(); // Get the current timestamp

    const product = await prisma.project.create({
      data: {
        owner: body.owner,
        template: body.template,
        cover: body.cover,
        title: "untitled",
      },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    return NextResponse.json(
      { message: "Could not create project" },
      { status: 500 }
    );
  }
}
