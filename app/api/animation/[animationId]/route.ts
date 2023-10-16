import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    animationId: string;
  };
}

export async function GET(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const newId = Number(params.animationId);
    console.log(typeof newId);

    const animation = await prisma.animation.findUnique({
      where: { productId: newId },
      include: {
        product: true, // Include the associated product
      },
    });

    return NextResponse.json(animation, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
