/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { loginSchema } from "@/utils/validation/loginSchema";
import showToast from "@/utils/showToast";

const initialData = {
  email: "",
  password_hash: "",
};

export const useLogin = () => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginInputField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors((prevErrors) => {
        const { [id]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleSubmission = async () => {
    try {
      loginSchema.parse(formData);

      setIsLoading(true);
      setErrors({});
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password_hash: formData.password_hash,
      });

      setIsLoading(false);

      if (result?.error) {
          setErrors({ general: 'Invalid Credentials. Please check your credentials and try again .'  });
          showToast("Invalid Credentials. Please check your credentials and try again.", "error")
      } else {
        showToast("Successfully logged in", "success")
        router.push("/");
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(fieldErrors);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "An unexpected error occurred. Please try again.",
        }));
      }
    }
  };

  return {
    formData,
    setFormData,
    handleSubmission,
    handleLoginInputField,
    errors,
    isLoading,
  };
};
