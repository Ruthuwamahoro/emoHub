import { Button } from "@/components/ui/button"
import { Github, Fingerprint, User } from "lucide-react"
import { BsGoogle } from "react-icons/bs"

export function AuthProviders() {


  return (
    <div className="space-y-4 w-full max-w-md">
      <Button 
        className="w-full"
        variant="outline"
      >
        <Github className="mr-2 h-5 w-5" /> Continue with GitHub
      </Button>
      
      <Button 
        className="w-full"
        variant="outline"
      >
        <BsGoogle className="mr-2 h-5 w-5" /> Continue with Google
      </Button>
      
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button 
        className="w-full"
        variant="secondary"
      >
        <User className="mr-2 h-5 w-5" /> Email Registration
      </Button>
    </div>
  )
}