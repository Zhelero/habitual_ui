import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {API_BASE} from "../api"
import ThemeToggle from "./ThemeToggle.jsx";


export default function LoginForm() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            const response = await fetch(`${API_BASE}/auth/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (Array.isArray(data.detail)) {
                    setErrors(data.detail.map((e) => e.msg));
                } else {
                    setErrors([data.detail || "Login failed"]);
                }
                setPassword("");
                return;
            }

            login(
                data.access_token,
                data.refresh_token
            );
        } catch (err) {
            setPassword("");
            setErrors([err.message]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-end">
                <ThemeToggle
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
            </div>

            <input
                autoFocus
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors([]);
                }}
                className={`w-full rounded-xl border px-4 py-2 outline-none 
                dark:bg-slate-800
                dark:text-slate-100
                dark:border-slate-700
                ${
                    errors.length > 0
                        ? "border-red-300"
                        : "border-slate-200 focus:border-slate-400"
                }`}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors([]);
                }}
                className={`w-full rounded-xl border px-4 py-2 outline-none 
                dark:bg-slate-800
                dark:text-slate-100
                dark:border-slate-700
                ${
                    errors.length > 0
                        ? "border-red-300"
                        : "border-slate-200 focus:border-slate-400"
                }`}
            />

            {errors.length > 0 && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3
                    dark:bg-red-950
                    dark:border-red-800
                ">
                    <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
                        {errors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                type="submit"
                disabled={
                    loading ||
                    !email.trim() ||
                    !password.trim()
                }
                className="
                    w-full rounded-xl
                    bg-slate-900
                    py-2
                    text-white
                    hover:bg-slate-800
                    disabled:opacity-50
                    disabled:cursor-not-allowed

                    dark:bg-slate-700
                    dark:hover:bg-slate-600
                    "
            >
                {loading ? "Signing in..." : "Login"}
            </button>
        </form>
    );
}