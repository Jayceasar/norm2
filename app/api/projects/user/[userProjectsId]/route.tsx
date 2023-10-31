import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const dynamic = "force-dynamic";

interface projectProps {
  params: {
    userProjectsId: string;
  };
}

export async function GET(context: projectProps) {
  const { params } = context;
  console.log(params);
  try {
    const projects = await prisma.project.findMany({
      where: {
        owner: "juliusiniekong@gmail.com", // Filter by the email field
      },
    });

    // Set Cache-Control header to no-cache
    const responseHeaders = {
      "Cache-Control": "no-cache",
    };

    return NextResponse.json(projects, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
