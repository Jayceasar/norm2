import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FC, ReactNode } from "react";

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "http://localhost:3000/dashboard" });
  };
  return (
    <Button onClick={loginWithGoogle} className=" w-full">
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
