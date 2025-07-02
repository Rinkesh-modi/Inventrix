import { createContext, useContext, useEffect, useState } from "react";
import { ContextProps } from "~/types/mainContext";
import { UserProps } from "~/types/auth";
import { useNavigate } from "@remix-run/react";
import toast from "react-hot-toast";
import { AxiosClient } from "~/utils/AxiosClient";

export const MainContext = createContext<ContextProps>({
  user: null,
  logoutHandler: () => {},
  fetchUserDetails: () => {},
});

export const useMainContext = () => useContext(MainContext);

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

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

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      if (!token) {
        return;
      }
      const response = await AxiosClient.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log("User data fetched:", data);
      setUser(data);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const data: ContextProps = {
    user,
    logoutHandler,
    fetchUserDetails,
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return <MainContext.Provider value={data}>{children}</MainContext.Provider>;
};
