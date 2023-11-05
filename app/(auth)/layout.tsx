import React, { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className=" w-screen min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  );
};

export default AuthLayout;
