const FILTER_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "all", label: "All" },
];

const SORT_OPTIONS = [
    { value: "pending", label: "Pending first" },
    { value: "completed", label: "Completed first" },
    { value: "streak", label: "By streak" },
    { value: "alphabet", label: "Alphabetical" },
];

export default function DashboardToolbar({
                                             archiveFilter,
                                             setArchiveFilter,

                                             sortBy,
                                             setSortBy,

                                             refreshing,
                                         }) {

    return (

        <div className="mb-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                {FILTER_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setArchiveFilter(option.value)}
                        disabled={refreshing}
                        className={`
                                        rounded-lg
                                        px-3
                                        py-1.5
                                        text-sm
                                        font-medium
                                        transition
    
                                        ${
                            archiveFilter === option.value
                                ? "bg-slate-900 text-white dark:bg-slate-600"
                                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                        }
                                    `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>


            <div className="flex items-center gap-2">
                <label
                    htmlFor="sort"
                    className="text-sm text-slate-500"
                >
                    Sort:
                </label>

                <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-slate-400

                                    dark:bg-slate-800
                                    dark:text-slate-200
                                "
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}