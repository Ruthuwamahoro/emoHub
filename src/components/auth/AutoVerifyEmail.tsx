"use client";
import React, { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "@/hooks/users/useLoginUser";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Mail } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { AlertTriangle } from "lucide-react";

const VerifyEmailContent: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const hasInitialized = useRef(false);
  
  const { 
    handleVerifyEmailSubmission, 
    isLoading, 
    isSuccess, 
    isError,
    errors
  } = useVerifyEmail({ token: token as string });

  useEffect(() => {
    if (token && !hasInitialized.current) {
      hasInitialized.current = true;
      handleVerifyEmailSubmission();
    }
  }, [token, handleVerifyEmailSubmission]); 

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 max-w-md w-full mx-4">
          <div className="mb-6 relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-orange-400 opacity-10 scale-110"></div>
            <AlertTriangle className="w-20 h-20 mx-auto text-orange-500 animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
            Token Missing
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto rounded-full mb-6"></div>
          
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            The verification link appears to be incomplete or invalid. Please check your email for the correct verification link.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => window.location.href = '/resend-verification'}
              className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3 mx-auto w-full"
            >
              <Mail className="w-5 h-5" />
              Resend Verification Email
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="group border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600 hover:text-orange-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto w-full"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-sm text-orange-700 font-medium mb-2">Need Help?</p>
            <p className="text-xs text-orange-600 leading-relaxed">
              Make sure you're clicking the verification link directly from your email. If the issue persists, contact support.
            </p>
          </div>
          
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="text-center p-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 transform hover:scale-105 transition-transform duration-300">
          <div className="relative mb-8">
            <Loader2 className="h-20 w-20 animate-spin text-orange-500 mx-auto relative z-10 filter drop-shadow-lg" />
          </div>
          
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text mb-4">
            Verifying Your Email...
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            Please wait while we verify your email address.
          </p>
          
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center p-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 max-w-md w-full mx-4">
          <div className="mb-6 relative">
            <CheckCircle2 className="w-20 h-20 mx-auto text-orange-500 animate-bounce" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
            Email Verified!
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto rounded-full mb-6"></div>
          
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Your email has been successfully verified. Welcome aboard! You can now access all features of your account.
          </p>
          
          <Button
            onClick={() => window.location.href = '/login'}
            className="group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3 mx-auto"
          >
            Continue to Login
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || errors.general) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-10 w-8 h-8 bg-amber-200/25 rounded-full animate-ping"></div>
        </div>
  
        <div className="relative z-10 text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full mx-4">
          <div className="relative mb-8">
            <div className="relative bg-orange-500 p-4 rounded-full inline-block">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
  
          <h2 className="text-2xl font-bold text-transparent bg-orange-600 bg-clip-text mb-6">
            Verification Failed
          </h2>
  
          <div className="mb-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {errors.general || "The verification link is invalid or has expired."}
            </p>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Don't worry!</span> This happens sometimes. You can try verifying again or request a new verification email.
              </p>
            </div>
          </div>
  
          <div className="space-y-4">
            <Button 
              onClick={() => handleVerifyEmailSubmission(undefined, true)} 
              className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/resend-verification'}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get New Verification Email
            </Button>
          </div>
  
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Tip:</span> Verification links expire after 24 hours for security reasons. If your link is old, request a new one.
            </p>
          </div>
  
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
  
        <div className="absolute top-20 left-20 w-6 h-6 bg-red-300/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-orange-400/40 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return null;
};

const VerifyEmailLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Loading...
      </h2>
      <p className="text-gray-600">
        Please wait while we prepare the verification page.
      </p>
    </div>
  </div>
);

export const AutoVerifyEmail: React.FC = () => {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
};