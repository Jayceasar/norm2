import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        title: body.title,
        published: body.published,
      },
    });

    // Create a new animation associated with the product
    const animation = await prisma.animation.create({
      data: {
        jsonData: body.jsonData, // Replace 'body.animationData' with your animation data
        productId: product.id, // Assign the product ID to establish the relationship
      },
    });

    // Return the created product and animation
    return NextResponse.json({ product, animation }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not create product" },
      { status: 500 }
    );
  }
}
