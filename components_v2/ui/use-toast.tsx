"use client";
import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  title?: string;
  type?: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
  showToast: (message: string, title?: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    title?: string,
    type: Toast["type"] = "info"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, title, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "before:bg-gradient-to-r before:from-green-500 before:to-emerald-600";
      case "error":
        return "before:bg-gradient-to-r before:from-red-500 before:to-rose-600";
      case "warning":
        return "before:bg-gradient-to-r before:from-yellow-500 before:to-orange-600";
      default:
        return "before:bg-gradient-to-r before:from-blue-500 before:to-purple-600";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`
                relative mb-4 min-w-[300px] max-w-md overflow-hidden rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800
                before:absolute before:left-0 before:top-0 before:h-full before:w-1 ${getToastStyles(
                  toast.type
                )}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {toast.title && (
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {toast.title}
                    </h3>
                  )}
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
