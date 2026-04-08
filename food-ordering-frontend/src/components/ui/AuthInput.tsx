import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import styles from "./AuthInput.module.css";

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Floating label text */
  label: string;
  /** Prefix icon (16–18 px Lucide icon recommended) */
  icon?: ReactNode;
  /** Inline field error — shows red border + message below */
  error?: string;
  /** Green valid state when field passes validation */
  valid?: boolean;
  /** Suffix slot — password toggle, check icon, etc. */
  suffix?: ReactNode;
}

/**
 * AuthInput — floating-label input (UIverse "clever-swan" pattern).
 *
 * IMPORTANT: always set `autoComplete` on the underlying input.
 * The floating label technique requires `placeholder=" "` (single space),
 * which this component sets automatically — do NOT override it.
 *
 * Works directly with React Hook Form's `{...register("field")}` spread
 * because it uses forwardRef to forward the ref callback.
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, error, valid, suffix, className = "", ...rest }, ref) => {
    return (
      <div className={styles.fieldWrapper}>
        <div className={styles.fieldInner}>
          {icon && (
            <span className={styles.fieldIcon} aria-hidden="true">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            placeholder=" "
            className={[
              styles.fieldInput,
              suffix ? styles.hasSuffix : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            data-error={error ? "true" : undefined}
            data-valid={valid && !error ? "true" : undefined}
            aria-invalid={!!error}
            {...rest}
          />

          <label
            className={styles.fieldLabel}
            htmlFor={rest.id}
          >
            {label}
          </label>

          {suffix && (
            <div className={styles.fieldSuffix}>{suffix}</div>
          )}
        </div>

        {error && (
          <p
            className={styles.fieldError}
            role="alert"
            id={rest.id ? `${rest.id}-error` : undefined}
          >
            <AlertCircle size={12} aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
