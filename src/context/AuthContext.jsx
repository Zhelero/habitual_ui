import { useState } from "react";
import { AuthContext } from "./authContextObject";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const login = (accessToken, refreshToken) => {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}