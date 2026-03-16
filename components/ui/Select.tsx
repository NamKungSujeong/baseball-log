import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
}

export default function Select({
  label,
  error,
  placeholder,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full rounded-xl border px-4 py-2.5 text-sm outline-none
          border-gray-200 bg-white text-gray-900
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          disabled:bg-gray-50 disabled:text-gray-400
          ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
