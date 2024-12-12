"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LucideMail, LucideLock, LucideEye, LucideEyeOff } from 'lucide-react'
import { useLogin } from '@/hooks/users/useLoginUser'
import { Loader2 } from 'lucide-react'
import { signIn } from "next-auth/react";


export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const { 
    formData,
    setFormData,
    handleSubmission,
    handleLoginInputField,
    errors,
    isLoading,
  } = useLogin()

  const handleOAuthLogin = async (provider: string) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: "/" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-3xl">
        <CardContent className="p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-blue-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleSubmission()
          }
         } 
         className="space-y-6">
            <div className="relative">
              <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input 
                type="email" 
                id="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleLoginInputField}
                className="pl-12 py-4 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ease-in-out"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors
              .email}</p>}
            </div>

            <div className="relative">
              <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                id="password_hash"
                value={formData.password_hash}
                onChange={handleLoginInputField}
                className="pl-12 pr-12 py-4 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ease-in-out"
                required
              />
              {errors.password_hash && <p className='text-red-500 text-sm mt-2'>{errors.password_hash}</p>}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <LucideEyeOff /> : <LucideEye />}
              </button>
            </div>

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button 
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 text-white font-semibold"
            >
                {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sign In...
                    </div>
                  ) : (
                    'Sign In'
                  )}  
            </Button>
          </form>

          <div className="flex items-center justify-center space-x-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="text-gray-600 text-sm">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center space-x-2"
                onClick={() => handleOAuthLogin("google")}
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center space-x-2"
                onClick={() => handleOAuthLogin("github")}
              >
                Github
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
