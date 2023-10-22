import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    id: string;
  };
}

export async function GET(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const newId = Number(params.id);
    console.log(params.id);

    const animation = await prisma.animation.findUnique({
      where: { productId: newId },
      // include: {
      //   product: true, // Include the associated product
      // },
    });

    return NextResponse.json(animation, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
