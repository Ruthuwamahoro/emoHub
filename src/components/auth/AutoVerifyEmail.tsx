"use client";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "@/hooks/users/useLoginUser";

export const AutoVerifyEmail: React.FC = () => {
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const hasInitialized = useRef(false);
  

  const { 
    handleVerifyEmailSubmission, 
    isLoading, 
    isSuccess, 
    isError,
    errors,
    resetVerificationState
  } = useVerifyEmail({ token: token as string });

  useEffect(() => {
    if (token && !hasInitialized.current) {
      console.log("Starting email verification for token:", token);
      hasInitialized.current = true;
      handleVerifyEmailSubmission();
    }
  }, [token]); 

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Verification Token Found
          </h2>
          <p className="text-gray-600">
            The verification link appears to be incomplete. Please check your email for the correct verification link.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verifying Your Email...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Email Verified Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your email has been verified. You can now access all features of your account.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  if (isError || errors.general) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-orange-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {errors.general || "The verification link is invalid or has expired."}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => handleVerifyEmailSubmission(undefined, true)} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors mr-3"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/resend-verification'}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};