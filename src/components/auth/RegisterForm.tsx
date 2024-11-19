"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LucideUser, LucideMail, LucideLock, LucideEye, LucideEyeOff } from "lucide-react";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-8 space-y-8 bg-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome!
            </h2>
            <p className="text-gray-600">
              Create an account and explore endless possibilities.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 py-4 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 py-4 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
              >
                {showPassword ? <LucideEyeOff /> : <LucideEye />}
              </button>
            </div>

            {/* Register Button */}
            <Button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 text-white font-semibold"
            >
              Register Now
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-red-500"
              >
                <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" />
              </svg>
              <span>Google</span>
            </Button>
            <Button
              variant="outline"
              className="py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-500"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-600"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.667-1.333h2.333v-4h-3.244c-3.932 0-5.756 1.853-5.756 5.134v1.866h-3z" />
              </svg>
              <span>Facebook</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
