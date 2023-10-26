// Modify this code to include error handling and better debugging

import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log(body);

    // Add validation for the request body
    if (!body.title || !body.price) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        cover: body.cover,
        tags: body.tags,
        price: Number(body.price),
        description: body.description,
        previewVideo: body.previewVideo,
      },
    });

    // Create a new animation associated with the product
    const animation = await prisma.animation.create({
      data: {
        jsonData: body.jsonData,
        productId: product.id,
        sound: body.sound,
      },
    });

    return NextResponse.json({ product, animation }, { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    return NextResponse.json(
      { message: "Could not create product" },
      { status: 500 }
    );
  }
}

// ...

// Ensure proper error handling in your React component
// It appears that you have some error handling in place for axios requests

// ...

// Debugging:
// 1. Check your server logs for more detailed error information.
// 2. Review your server-side code to ensure it's handling requests properly.
// 3. Check Prisma configuration, database connectivity, and permissions.
// 4. Implement proper request validation and error handling on the client side.
// 5. Test the route manually with different inputs to identify the problem.

// If the error persists, further debugging and inspection of the server-side code will be necessary to determine the specific issue.
