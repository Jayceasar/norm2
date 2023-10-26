import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    projectId: string;
  };
}

export async function GET(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const newId = Number(params.projectId);
    console.log(params.projectId);

    const animation = await prisma.project.findUnique({
      where: { id: newId },
      // include: {
      //   product: true, // Include the associated product
      // },
    });

    return NextResponse.json(animation, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PATCH(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const newId = Number(params.projectId);

    // Parse the request body to get the updated data
    const {
      title,
      description,
      cover,
      jsonData,
      template,
      sound,
      scenes,
      firebaseJSONURL,
    } = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id: newId },
      data: {
        title, // Update the title
        description, // Update the description
        cover, // Update the cover
        jsonData, // Update the jsonData
        sound, // Update the sound
        scenes, // Update the scenes
        firebaseJSONURL,
      },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
