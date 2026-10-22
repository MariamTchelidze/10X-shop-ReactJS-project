import type { ToastMessage } from "../../context/ToastContext";

export type ToastType = "success" | "info" | "error";

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-zara-black text-zara-white",
  info: "bg-zara-light text-zara-black",
  error: "bg-zara-white text-zara-black border border-zara-black",
};

const typeIcons: Record<ToastType, string> = {
  success: "✓",
  info: "i",
  error: "!",
};

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex min-h-14 animate-[toast-in_220ms_ease-out] items-center gap-3 px-4 py-3 shadow-lg ${typeStyles[toast.type]}`}
    >
      <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs">
        {typeIcons[toast.type]}
      </span>
      <p className="flex-1 text-xs font-medium uppercase tracking-[0.12em]">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onClose(toast.id)}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-lg opacity-75 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        ×
      </button>
    </div>
  );
}
