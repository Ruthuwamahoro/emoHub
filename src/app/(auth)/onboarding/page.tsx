"use client"
import { EmoHubOnboarding } from "@/components/auth/OnboardingUserProfile"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OnBordingProfile(){
    const { data: session } = useSession();
    const router = useRouter();
    
    if (session?.user?.isOnboardingCompleted) {
        router.push("/dashboard");
        return null;
    }
    
    return <EmoHubOnboarding />;
    
}