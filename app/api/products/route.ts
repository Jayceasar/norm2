import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany();

    // Set Cache-Control header to no-cache
    const responseHeaders = {
      "Cache-Control": "no-cache",
    };

    return NextResponse.json(products, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
