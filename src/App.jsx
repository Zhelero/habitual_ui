import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./AuthPage";
import HabitualDashboard from "./HabitualDashboard";
import HabitDetailPage from "./HabitDetailPage";

export default function App() {
    const { isAuthenticated } = useAuth();

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    if (!isAuthenticated) {
        return <AuthPage />;
    }

  return (
      <Routes>
          <Route
              path="/"
              element={<HabitualDashboard darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
        <Route path="/habits/:id" element={<HabitDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}