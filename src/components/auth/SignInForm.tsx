"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const { signIn } = useAuthActions();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("flow", "signIn");

    try {
      await signIn("password", formData);
    } catch (error: any) {
      const message = error.message?.includes("Invalid password")
        ? "Invalid password. Please try again."
        : "Could not sign in. Try signing up.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-form-field" onSubmit={handleSubmit}>
      <input
        className="auth-input-field"
        type="email"
        name="email"
        placeholder="Email"
        required
      />

      <input
        className="auth-input-field"
        type="password"
        name="password"
        placeholder="Password"
        required
      />

      <button className="auth-button" type="submit" disabled={submitting}>
        Sign in
      </button>

      <div className="text-center text-sm text-secondary">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-primary hover:underline font-medium"
          onClick={onSwitchToSignUp}
        >
          Sign up instead
        </button>
      </div>
    </form>
  );
}
