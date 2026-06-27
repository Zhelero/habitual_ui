export const HABIT_COLORS = [
    { value: "slate", swatch: "bg-slate-400" },
    { value: "blue", swatch: "bg-blue-400" },
    { value: "emerald", swatch: "bg-emerald-400" },
    { value: "amber", swatch: "bg-amber-400" },
    { value: "rose", swatch: "bg-rose-400" },
    { value: "violet", swatch: "bg-violet-400" },
];

export function habitColorClass(color) {
    return HABIT_COLORS.find((c) => c.value === color)?.swatch ?? null;
}