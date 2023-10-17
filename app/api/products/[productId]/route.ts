import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    productId: string;
  };
}

export async function DELETE(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const newId = Number(params.productId);

    await prisma.product.delete({
      where: { id: newId },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.log(error);
  }
}

// export async function PATCH(req: Request, context: contextProps) {
//   const { params } = context;
//   const body = await req.json();
//   const newId = Number(params.productId);

//   try {
//     const product = await prisma.product.update({
//       where: { id: newId },
//       data: {
//         title: body.title,
//         published: body.published,
//       },
//     });
//     return NextResponse.json({ message: "Update successful" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Could not update product" },
//       { status: 500 }
//     );
//   }
// }
