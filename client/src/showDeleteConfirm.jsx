import toast from "react-hot-toast";

export const showDeleteConfirm = ({ message, onConfirm }) => {
  toast.custom((t) => (
    <div
      className={`min-w-[260px] bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-lg rounded-xl p-4 transition-all ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
        {message}
      </p>

      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1.5 rounded-md text-sm bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>

        <button
          className="px-3 py-1.5 rounded-md text-sm bg-red-600 text-white"
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ));
};
