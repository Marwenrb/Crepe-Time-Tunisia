import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./AuthButton.module.css";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Shows inline spinner and disables the button */
  loading?: boolean;
}

/**
 * AuthButton — shimmer-sweep submit button (UIverse "evil-seahorse" pattern).
 *
 * - Full-width by default (width: 100% in CSS module)
 * - Disabled automatically when `loading` is true
 * - Spinner + text rendered side-by-side when loading
 */
const AuthButton = ({
  children,
  loading = false,
  disabled,
  type = "submit",
  ...rest
}: AuthButtonProps) => (
  <button
    type={type}
    disabled={loading || disabled}
    className={styles.btn}
    aria-busy={loading}
    {...rest}
  >
    {loading && <span className={styles.spinner} aria-hidden="true" />}
    {children}
  </button>
);

export default AuthButton;
