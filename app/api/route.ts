import { NextResponse } from "next/server";

export async function GET() {
  const todos = [1, 4, 7, 10];

  return NextResponse.json(todos);
}
