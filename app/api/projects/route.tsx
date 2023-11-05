import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        cover: true,
        sound: true,
        scenes: true,
        firebaseJSONURL: true,
        owner: true,
        collaborators: true,
        previewProject: true,
        renderedVideoDownloadLink: true,
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
