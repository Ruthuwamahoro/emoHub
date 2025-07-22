"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResendVerification } from '@/hooks/users/useResendVerification';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  
  const {
    handleResendVerification,
    errors,
    clearErrors,
    isLoading,
    isSuccess,
    isError
  } = useResendVerification();

  const onSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    await handleResendVerification(email);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full mx-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 animate-bounce">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Email Sent Successfully!</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                We've sent a new verification email to 
              </p>
              <p className="font-bold text-sm text-slate-800 mt-2 bg-green-50 py-2 px-4 rounded-lg inline-block text">
                {email}
              </p>
              <p className="text-gray-600 mt-4">
                Please check your inbox and click the verification link to complete your account setup.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Continue to Login
              </Button>
              <Button
                onClick={() => {
                  setEmail('');
                  clearErrors();
                }}
                className="w-full text-white hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors duration-200"
              >
                Send to Different Email Address
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Didn't receive the email?</span> Check your spam folder or try resending to a different email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full mx-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Resend Verification</h1>
            <p className="text-blue-100">
              Enter your email to receive a new verification link
            </p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearErrors();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onSubmit(e);
                    }
                  }}
                  className={`w-full px-4 py-4 border-2 rounded-md shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-slate-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
              {errors.email && (
                <div className="mt-2 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-sm text-red-600">{errors.email}</p>
                </div>
              )}
            </div>

            {errors.general && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-4 px-6 rounded-md hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Email...
                </span>
              ) : (
                'Send Verification Email'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Button
              onClick={() => router.push('/login')}
              className="text-slate-600 hover:text-slate-800 font-medium hover:underline transition-colors duration-200"
            >
              ← Back to Login
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium">Need help?</span> Make sure to check your spam folder after sending the verification email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}