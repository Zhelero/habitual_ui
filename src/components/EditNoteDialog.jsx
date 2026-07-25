import { useState } from "react";
import Modal from "./Modal";

export default function EditNoteDialog({ habit, initialNote, onSubmit, onCancel }) {
    const [note, setNote] = useState(initialNote ?? "");

    if (!habit) return null;

    return (
        <Modal onClose={onCancel}>

            <h2 className="text-lg font-semibold">
                Edit today&#39;s note
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                Only today&#39;s note can be edited — past days are read-only.
            </p>

            <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                maxLength={500}
                rows={5}
                data-testid="edit-note-textarea"
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

            <div className="mt-1 text-right text-xs text-slate-400" data-testid="edit-note-char-count">
                {note.length} / 500
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
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
                    type="button"
                    onClick={() => onSubmit(note.trim())}
                    className="
                        rounded-xl
                        px-4
                        py-2
                        text-sm
                        bg-slate-900
                        text-white
                        hover:bg-slate-800
                    "
                >
                    Save
                </button>
            </div>
        </Modal>
    );
}