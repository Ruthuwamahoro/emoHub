import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface ResendVerificationData {
  email: string;
}

const resendVerificationEmail = async (email: string) => {
  try {
    console.log('Resending verification email to----------------:', email);
    const response = await axios.post('/api/resend-verification', { email });
    console.log('Resend verification response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to resend verification email');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const useResendVerification = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (response) => {
      setErrors({});
      console.log('Verification email sent successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to resend verification email';
      setErrors({ general: errorMessage });
      console.error('Resend verification error:', error);
    }
  });

  const handleResendVerification = async (email: string) => {
    if (!email?.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setErrors({});
    try {
      await resendMutation.mutateAsync(email);
    } catch (error) {
      return error;
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    handleResendVerification,
    errors,
    clearErrors,
    isLoading: resendMutation.isPending,
    isSuccess: resendMutation.isSuccess,
    isError: resendMutation.isError
  };
};