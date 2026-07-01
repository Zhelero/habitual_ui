import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function AuthPage() {
    const [mode, setMode] = useState("login");

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-800">
                <h1 className="mb-2 text-center text-3xl font-semibold dark:text-slate-100">
                    Habitual
                </h1>

                <p className="mb-6 text-center text-slate-500 dark:text-slate-400">
                    Build habits. Keep streaks.
                </p>

                <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 dark:text-slate-700 dark:bg-slate-900">
                    <button
                        data-testid="auth-tab-login"
                        onClick={() => setMode("login")}
                        className={`flex-1 rounded-xl py-2 text-sm ${
                            mode === "login"
                                ? "bg-white shadow-sm dark:bg-slate-600 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-300"
                        }`}
                    >
                        Login
                    </button>

                    <button
                        data-testid="auth-tab-register"
                        onClick={() => setMode("register")}
                        className={`flex-1 rounded-xl py-2 text-sm ${
                            mode === "register"
                                ? "bg-white shadow-sm dark:bg-slate-600 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-300"
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