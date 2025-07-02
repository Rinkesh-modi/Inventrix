import { Outlet } from "@remix-run/react";
import React from "react";

const AuthRoute = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthRoute;
