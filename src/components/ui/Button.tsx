import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-contrast hover:opacity-90 active:opacity-100 focus-visible:ring-primary",
  secondary:
    "bg-secondary text-secondary-contrast hover:brightness-95 focus-visible:ring-primary",
  ghost:
    "bg-transparent text-ink hover:bg-soft focus-visible:ring-primary",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1ebe5b] focus-visible:ring-[#25D366]",
};

const SIZES: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  );
});

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton({ variant = "primary", size = "md", className = "", ...rest }, ref) {
    return (
      <a
        ref={ref}
        className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...rest}
      />
    );
  },
);
