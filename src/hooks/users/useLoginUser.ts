/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useCallback, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { z } from "zod";

import { loginSchema } from "@/utils/validation/loginSchema";
import showToast from "@/utils/showToast";
import { userVerify } from "@/services/user/userVerify";

const initialData = {
  email: "",
  password_hash: "",
};

export const useLogin = () => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

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
        setErrors({ general: result.error });
        if(result?.error === "AccessDenied"){
          showToast("Unauthorized", "error");
        } else {
          showToast("Invalid credentials", "error")
        }
      } else if (result?.ok) {
        showToast("Successfully logged in", "success");
        
        // Force page reload to get fresh session data
        window.location.href = "/dashboard";
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



export const useVerifyEmail = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasTriedVerification = useRef(false);

  const verifyMutation = useMutation({
    mutationFn: userVerify,
    onSuccess: (response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        setErrors({});
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Invalid or expired token";
      setErrors({ general: errorMessage });
      showToast(errorMessage, "error");
    }
  });

  const handleVerifyEmailSubmission = useCallback(async (tokenToVerify?: string, forceRetry = false) => {
    if (hasTriedVerification.current && !forceRetry) {
      return;
    }

    const verificationToken = tokenToVerify || token;
    
    if (!verificationToken?.trim()) {
      setErrors({ token: "Token is required" });
      return;
    }

    hasTriedVerification.current = true;

    try {
      await verifyMutation.mutateAsync(verificationToken);
    } catch (error) {
      console.error("Verification error:", error);
    }
  }, [token, verifyMutation]);

  const clearErrors = () => {
    setErrors({});
  };

  const resetVerificationState = () => {
    hasTriedVerification.current = false;
    setErrors({});
  };

  return {
    handleVerifyEmailSubmission,
    errors,
    clearErrors,
    resetVerificationState,
    isLoading: verifyMutation.isPending,
    isSuccess: verifyMutation.isSuccess,
    isError: verifyMutation.isError
  };
};