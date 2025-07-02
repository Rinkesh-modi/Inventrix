import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useMainContext } from "~/context/MainContext";

export function useAuthGuard() {
  const { user } = useMainContext();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      navigate("/");
    }
  }, [user, navigate]);
}
