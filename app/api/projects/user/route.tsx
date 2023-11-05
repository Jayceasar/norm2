import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { parse } from "url";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { url } = request;
    // Parse the URL to access the query parameters
    const { query } = parse(url, true);

    // Access the 'email' parameter from the query
    const { email } = query;
    console.log(email);

    const projects = await prisma.project.findMany({
      where: {
        owner: `${email}`, // Filter by the email field
      },
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
