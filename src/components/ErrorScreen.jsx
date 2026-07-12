import {Link} from "react-router-dom";

export default function ErrorScreen({ message, hint, actionLabel, onAction, actionHref }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="rounded-2xl bg-white p-8 shadow-sm text-center dark:bg-slate-800">
                <p className="text-red-500 font-medium">{message}</p>
                {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
                {actionHref ? (
                    <Link to={actionHref} className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
                        {actionLabel}
                    </Link>
                ) : (
                    <button onClick={onAction} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}