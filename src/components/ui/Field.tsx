import { type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react";

type FieldWrapperProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-primary" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

const INPUT_BASE =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  function TextInput({ className = "", error, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={`${INPUT_BASE} ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} ${className}`}
        {...rest}
      />
    );
  },
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(function TextArea({ className = "", error, rows = 4, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${INPUT_BASE} resize-y ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} ${className}`}
      {...rest}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
>(function Select({ className = "", error, children, ...rest }, ref) {
  return (
    <select
      ref={ref}
      className={`${INPUT_BASE} appearance-none bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12 ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} ${className}`}
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Cpath d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
      }}
      {...rest}
    >
      {children}
    </select>
  );
});

export function Checkbox({
  id,
  label,
  error,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { id: string; label: ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer text-sm text-ink">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 rounded border border-border text-primary focus:ring-2 focus:ring-primary"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="ml-8 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
