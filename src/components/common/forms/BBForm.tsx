import { createContext, useContext } from "react";
import type { AnyFormApi } from "@tanstack/react-form";

const BBFormContext = createContext<AnyFormApi | null>(null);

export function useBBFormContext(): AnyFormApi {
  const ctx = useContext(BBFormContext);
  if (!ctx) {
    throw new Error(
      "BB form components must be rendered inside a <BBForm> with a `form` prop.",
    );
  }
  return ctx;
}

type BBFormProps = {
  form?: AnyFormApi;
  children: React.ReactNode;
  errorMessage?: string | null;
  className?: string;
  role?: React.AriaRole;
  onSubmit?: React.SubmitEventHandler<HTMLFormElement>;
};

export default function BBForm({
  form,
  children,
  errorMessage,
  className,
  role,
  onSubmit,
}: BBFormProps) {
  const formElement = (
    <form
      className={className ?? "space-y-3"}
      role={role ?? "form"}
      noValidate
      onSubmit={(e) => {
        if (form) {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
          return;
        }
        onSubmit?.(e);
      }}
    >
      {errorMessage && (
        <div
          role="alert"
          className="text-highlighted text-sm border-l-2 border-highlighted pl-2"
        >
          {errorMessage}
        </div>
      )}
      {children}
    </form>
  );

  if (!form) {
    return formElement;
  }

  return (
    <BBFormContext.Provider value={form}>{formElement}</BBFormContext.Provider>
  );
}
