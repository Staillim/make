import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all duration-200",
            "placeholder:text-zinc-400",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
            "dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:placeholder:text-zinc-500",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-zinc-300 dark:border-zinc-700",
            icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
