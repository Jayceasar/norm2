"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  LucideContainer,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";

interface Session {
  user: {
    name?: string;
    username: string;
    // Add other properties as needed
  };
  // Add other properties as needed
}

const UserAccountNav = () => {
  const { data: session } = useSession();
  const [displayLetter, setDisplayLetter] = useState<string>("");
  // const  = session?.user?.name[0];

  useEffect(() => {
    if (session?.user?.name !== "" || session?.user?.username !== "") {
      if (session && session.user && session.user.name) {
        const firstLetter = session.user.name[0];
        setDisplayLetter(firstLetter);
      } else if (session && session.user && session.user.email) {
        const firstLetter = session.user.email[0];
        setDisplayLetter(firstLetter);
      }
    }
  }, [session]);

  return (
    <div className=" relative flex gap-2">
      <button
        // href={"/"}
        className=" hidden md:flex items-center justify-center text-[10px] md:text-xs  py-0 md:py-1 px-6 border border-neutral-500 hover:bg-[#ff7d26] hover:px-9 text-white bg-black  rounded-full transition-all"
      >
        Go pro
      </button>

      <ModeToggle />

      {/* <Link href="/dashboard">
        {session?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <div className=" w-8 md:w-10 aspect-square rounded-full border border-neutral-500 overflow-hidden transition-all">
            <div
              className="w-full h-full "
              style={{
                backgroundImage: `url(${session?.user?.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        ) : (
          <div>{displayLetter}</div>
        )}
      </Link> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <button className=" w-8 md:w-10 aspect-square rounded-full border border-neutral-500 overflow-hidden transition-all">
              <div
                className="w-full h-full "
                style={{
                  backgroundImage: `url(${session?.user?.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              ></div>
            </button>
          ) : (
            <div className=" flex items-center justify-center bg-black w-8 md:w-10 aspect-square rounded-full border border-neutral-500 overflow-hidden transition-all">
              {displayLetter}
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56  mr-2 md:mr-8 mt-2">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={`/dashboard`}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>

            <Link href={`/bucket`}>
              <DropdownMenuItem>
                <LucideContainer className="mr-2 h-4 w-4" />
                <span>Bucket</span>
                <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem disabled>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={`/team`}>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Team</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Team</span>
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud className="mr-2 h-4 w-4" />
            <span>API</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAccountNav;
