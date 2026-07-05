import { useContext } from "react";
import { AuthContext } from "../context/authContextObject";

export function useAuth() {
    return useContext(AuthContext);
}