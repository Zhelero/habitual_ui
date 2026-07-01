import {useEffect, useState} from "react";
import {API_BASE} from "../api"
import ThemeToggle from "./ThemeToggle.jsx";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");
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
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE}/auth/register/`, {
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
                setSuccess("");

                if (Array.isArray(data.detail)) {
                    setErrors(data.detail.map((e) => e.msg));
                } else {
                    setErrors([data.detail || "Registration failed"]);
                }
                setPassword("");
                return;
            }

            setSuccess(
                "Account created. Please sign in."
            );
            setErrors([]);

            setEmail("");
            setPassword("");
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
                    setSuccess("");
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
                    setSuccess("");
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

            {success && (
                <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    {success}
                </p>
            )}

            <button
                type="submit"
                data-testid="auth-tab-register-button"
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
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:bg-slate-700
                    dark:hover:bg-slate-600
                "
            >
                {loading ? "Creating account..." : "Register"}
            </button>
        </form>
    );
}