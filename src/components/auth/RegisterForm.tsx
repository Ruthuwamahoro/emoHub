"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LucideUser, LucideMail, LucideLock, LucideEye, LucideEyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { useAddUsers } from "@/hooks/users/useRegister";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {         formData,
    errors,
    handleChange,
    handleSubmit,
    isPending } = useAddUsers()


  const handleOAuthLogin = async (provider: string) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: "/" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="flex flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-lg border-none">
        <div className="relative w-1/2">
          <Image
            src="https://i.pinimg.com/736x/c1/40/78/c1407895e825217b71cafe4d259736ac.jpg"
            alt="mental health image"
            fill
            className="object-cover"
          />
        </div>

        <div className="w-1/2 bg-white p-8">
          <CardContent className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome to <span className="text-purple-600">talk</span>Heal!</h2>
              <p className="text-gray-600">Create an account and explore endless possibilities.</p>
            </div>
            <form onSubmit={(e: FormEvent) =>{
              e.preventDefault();
              handleSubmit()
            }
            }
              >
                <div className="space-y-4">
                  <p className="mb-2 text-gray-600">Full Name</p>
                  <div className="relative">
                  {/* <FaRegUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/> */}
                  <Input
                      type="text"
                      id= "fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full py-4 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />

                    {errors.fullName && <p className="text-red-500 text-sm mx-4">{errors.fullName}</p>}
                  </div>
                  <div>
                    <p className="mb-2 text-gray-600">Username</p>
                    <div className="relative">
                      <FaRegUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
                      <Input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="pl-12 w-full py-4 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                      {errors.username && <p className="text-red-500 text-sm mx-4">{errors.username}</p>}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-gray-600">Email</p>
                    <div className="relative">
                      <LucideMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-12 w-full py-4 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                      {errors.email && <p className="text-red-500 text-sm mx-4">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-gray-600">Password</p>
                    <div className="relative">
                      <LucideLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password_hash"
                        value={formData.password_hash}
                        onChange={handleChange}
                        className="pl-12 pr-12 w-full py-4 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                      {errors.password_hash && <p className="text-red-500 text-sm mx-4">{errors.password_hash}</p>}

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
                      >
                        {showPassword ? <LucideEyeOff /> : <LucideEye />}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full py-3 my-5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold">
                  {isPending ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </div>
                  ) : (
                    'Register now'
                  )}                  
                  </Button>
                </div>

              </form>

            <Link href="/login" className="pt-2 flex justify-center">Already have an account? Sign In</Link>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
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
        </div>
      </Card>
    </div>
  );
}
