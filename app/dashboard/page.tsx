import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function page() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div>
        Dashboard
        <p>Welcome {session?.user.username || session?.user.name} </p>
      </div>
    );
  }

  return <p>Please log in</p>;
}

export default page;
