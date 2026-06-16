import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HabitualDashboard from "./HabitualDashboard";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("login");

  if (isAuthenticated) {
    return <HabitualDashboard />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-3xl font-semibold">
          Habitual
        </h1>

        <p className="mb-6 text-center text-slate-500">
          Build habits. Keep streaks.
        </p>

        <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-xl py-2 text-sm ${
              mode === "login"
                ? "bg-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-xl py-2 text-sm ${
              mode === "register"
                ? "bg-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm />
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  );
}