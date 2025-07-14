import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

interface VerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function VerificationPopup({ isOpen, onClose, userEmail }: VerificationPopupProps) {
  console.log("isOpen", isOpen)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
      <DialogTitle className="text-center">Email verification sent Successfully</DialogTitle>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <DialogHeader className="text-center relative z-10 pt-8">
          <div className="mx-auto mb-6 relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 shadow-lg animate-bounce">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 relative z-10 px-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/50 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Next Steps:
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">1</span>
                </div>
                <span>Check your email inbox (and spam folder)</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <span>Click the verification link in the email</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <span>Return to login and access your account</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 font-bold text-xs">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">Verification Required</p>
                <p className="text-xs text-amber-700">
                  You won't be able to log in until you verify your email address.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pb-6 px-6 relative z-10">
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}