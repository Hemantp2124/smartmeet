import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "default" | "destructive" | "success";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

type ToastContextType = {
  toast: (props: ToastProps) => void;
  dismiss: (toastId?: string) => void;
  toasts: ToastProps[];
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const showToast = (props: ToastProps) => {
    const id = props.id || Math.random().toString(36).substring(2, 11);
    setToasts((prev) => [...prev, { ...props, id }]);

    if (props.duration) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration);
    }
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    } else {
      setToasts([]);
    }
  };

  return (
    <ToastContext.Provider value={{ toast: showToast, dismiss, toasts }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center justify-between w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400",
              {
                "bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-200":
                  toast.variant === "success",
                "bg-red-50 text-red-700 dark:bg-red-800 dark:text-red-200":
                  toast.variant === "destructive",
              },
              toast.className
            )}
            role="alert"
          >
            <div className="flex items-center">
              <div className="ml-3 text-sm font-normal">
                {toast.title && (
                  <p className="text-sm font-semibold">{toast.title}</p>
                )}
                {toast.description && (
                  <p className="text-sm">{toast.description}</p>
                )}
                {toast.children}
              </div>
            </div>
            <button
              type="button"
              className="ml-2 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => dismiss(toast.id)}
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center justify-between w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400",
            {
              "bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-200":
                toast.variant === "success",
              "bg-red-50 text-red-700 dark:bg-red-800 dark:text-red-200":
                toast.variant === "destructive",
            },
            toast.className
          )}
          role="alert"
        >
          <div className="flex items-center">
            <div className="ml-3 text-sm font-normal">
              {toast.title && (
                <p className="text-sm font-semibold">{toast.title}</p>
              )}
              {toast.description && (
                <p className="text-sm">{toast.description}</p>
              )}
              {toast.children}
            </div>
          </div>
          <button
            type="button"
            className="ml-2 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => dismiss(toast.id)}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
