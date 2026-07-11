import { useState } from "react";

export default function CompletionNoteDialog({
                                                 habit,
                                                 onSubmit,
                                                 onCancel,
                                             }) {
    const [note, setNote] = useState("");

    if (!habit) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">

                <h2 className="text-lg font-semibold">
                    Complete habit
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Add an optional note for today&#39;s completion.
                </p>

                <textarea
                    autoFocus
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    maxLength={500}
                    rows={5}
                    className="
                        mt-4
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        p-3
                        resize-none
                        outline-none
                        focus:border-slate-500
                        dark:border-slate-700
                        dark:bg-slate-900
                    "
                />

                <div className="mt-6 flex justify-end gap-2">

                    <button
                        onClick={onCancel}
                        className="
                            rounded-xl
                            px-4
                            py-2
                            text-sm
                            bg-slate-200
                            hover:bg-slate-300
                            dark:bg-slate-700
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSubmit("")}
                        className="
                            rounded-xl
                            px-4
                            py-2
                            text-sm
                            bg-slate-100
                            text-slate-700
                            hover:bg-slate-200
                        "
                    >
                        Skip note
                    </button>

                    <button
                        onClick={() => onSubmit(note.trim())}
                        disabled={!note.trim()}
                        className="
                            rounded-xl
                            px-4
                            py-2
                            text-sm
                            bg-slate-900
                            text-white
                            hover:bg-slate-800
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        Save
                    </button>



                </div>
            </div>
        </div>
    );
}