import * as React from "react";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/Button"; // uses the same style system you showed

export type LegacyVariant = "primary" | "secondary" | "danger";
export type ButtonVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ActionProps {
  loading?: boolean | string; // true or specific action key
  onAction: (action: string, payload?: any) => void;
}

export type ActionKey = string;

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: ActionKey;
  label: string;
  loading?: boolean;
  /**
   * Accept legacy variants from old API and map to the unified Button variants.
   * - primary   -> default
   * - secondary -> secondary
   * - danger    -> destructive
   */
  variant?: LegacyVariant | ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick: () => void;
}

function mapVariant(v?: LegacyVariant | ButtonVariant): ButtonVariant {
  if (!v) return "default";
  if (v === "primary") return "default";
  if (v === "danger") return "destructive";
  return v as ButtonVariant; // secondary / outline / ghost / link / destructive / default
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  label,
  loading = false,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled || loading) return;
    onClick();
  };

  const klass = cn(buttonVariants({ variant: mapVariant(variant), size }), "w-full", className);

  return (
    <button
      type="button"
      aria-label={label}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      disabled={disabled || loading}
      onClick={handleClick}
      data-action={action}
      className={klass}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 mr-2 text-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="60"
          />
        </svg>
      )}
      <span>{loading ? `${label}...` : label}</span>
    </button>
  );
};
