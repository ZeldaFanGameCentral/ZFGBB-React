import { useStore } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";

type BBSubmitProps = {
  children: React.ReactNode;
  pendingChildren?: React.ReactNode;
  /** Forces the button to disabled regardless of form state (e.g., outer mutation pending). */
  disabled?: boolean;
  className?: string;
};

export default function BBSubmit({
  children,
  pendingChildren,
  disabled,
  className,
}: BBSubmitProps) {
  const form = useBBFormContext();
  const { canSubmit, isSubmitting } = useStore(form.store, (state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  }));

  const buttonDisabled = disabled || !canSubmit || isSubmitting;

  return (
    <button
      type="submit"
      disabled={buttonDisabled}
      className={
        className ??
        "w-full p-2 bg-accented border border-default disabled:opacity-50"
      }
    >
      {isSubmitting ? (pendingChildren ?? children) : children}
    </button>
  );
}
