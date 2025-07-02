import { UserProps } from "./auth";

export interface ContextProps{
    user: UserProps | null;
    logoutHandler: () => void; 
    fetchUserDetails:()=>void;
}