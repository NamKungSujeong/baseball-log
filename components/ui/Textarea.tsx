import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`
          w-full rounded-xl border px-4 py-2.5 text-sm outline-none resize-none
          border-gray-200 bg-white text-gray-900 placeholder-gray-400
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          ${error ? "border-red-400" : ""}
          ${className}
        `}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
