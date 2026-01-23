"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export function AuthForm() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const { signIn } = useAuthActions();

  const handleAnonSignIn = async () => {
    try {
      await signIn("anonymous");
    } catch (error) {
      console.error("Anonymous sign-in error:", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-form-section">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {flow === "signIn" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-secondary text-sm">
          {flow === "signIn"
            ? "Sign in to your account"
            : "Join us to get started"}
        </p>
      </div>

      {flow === "signIn" ? (
        <SignInForm onSwitchToSignUp={() => setFlow("signUp")} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setFlow("signIn")} />
      )}

      <div className="mt-form-section flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-secondary">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        className="auth-button w-full mt-form-field"
        onClick={handleAnonSignIn}
      >
        Continue as guest
      </button>
    </div>
  );
}
