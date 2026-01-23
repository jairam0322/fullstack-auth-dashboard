"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const { signIn } = useAuthActions();
  const createProfile = useMutation(api.profiles.createProfileOnSignup);
  const currentUser = useQuery(api.auth.loggedInUser);
  const [submitting, setSubmitting] = useState(false);

  const pendingFirstNameRef = useRef<string | null>(null);
  const profileCreatedRef = useRef(false);

  // Create profile after successful signup
  useEffect(() => {
    const createUserProfile = async () => {
      if (
        currentUser &&
        pendingFirstNameRef.current &&
        !profileCreatedRef.current
      ) {
        try {
          await createProfile({
            userId: currentUser._id,
            firstName: pendingFirstNameRef.current,
            lastName: "",
          });

          profileCreatedRef.current = true;
          pendingFirstNameRef.current = null;
        } catch (err) {
          console.error("Profile creation failed:", err);
        }
      }
    };

    createUserProfile();
  }, [currentUser, createProfile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("flow", "signUp");

    try {
      const firstName = formData.get("firstName") as string;
      pendingFirstNameRef.current = firstName;
      profileCreatedRef.current = false;

      await signIn("password", formData);
    } catch (error: any) {
      const message = error.message?.includes("Invalid password")
        ? "Invalid password. Please try again."
        : "Could not sign up. Try signing in.";

      toast.error(message);
      pendingFirstNameRef.current = null;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-form-field" onSubmit={handleSubmit}>
      <input
        className="auth-input-field"
        type="text"
        name="firstName"
        placeholder="Your name"
        required
      />

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
        Sign up
      </button>

      <div className="text-center text-sm text-secondary">
        Already have an account?{" "}
        <button
          type="button"
          className="text-primary hover:underline font-medium"
          onClick={onSwitchToSignIn}
        >
          Sign in instead
        </button>
      </div>
    </form>
  );
}
