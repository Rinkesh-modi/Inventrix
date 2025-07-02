import { createContext, useContext, useState } from "react";
import { ContextProps } from "~/types/mainContext";
import { UserProps } from "~/types/auth";
import { useNavigate } from "@remix-run/react";
import toast from "react-hot-toast";

export const MainContext = createContext<ContextProps>({
  user: null,
  logoutHandler: () => {},
});

export const useMainContext = () => useContext(MainContext);

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const navigate = useNavigate();

  const logoutHandler = () => {
    try {
      setUser(null);
      localStorage.clear();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const data = {
    user,
    logoutHandler,
  };
  return <MainContext.Provider value={data}>{children}</MainContext.Provider>;
};
