"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSession , signOut} from "next-auth/react";
import { Brain } from "lucide-react";
import { getInitials } from "./TopNav";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AvatarImage } from "../ui/avatar";
import { CircleUser } from "lucide-react";
import { COMMON_LINKS, ROLE_BASED_LINKS } from "@/constants/roles";
import { useRouter } from "next/navigation";







const SidebarSkeleton = ({ open }: { open: boolean }) => (
  <div className={cn("h-screen")}>
    <Sidebar open={open} setOpen={() => {}}>
      <SidebarBody className="justify-between gap-10 bg-slate-900 text-white">
        <div className="flex flex-col flex-1 overflow-hidden">
          {open ? <Logo /> : <LogoIcon />}
          
          <div className="mt-8 flex flex-col gap-2">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg animate-pulse"
              >
                <div className="w-5 h-5 bg-slate-700 rounded"></div>
                {open && <div className="w-24 h-4 bg-slate-700 rounded"></div>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
        </div>
      </SidebarBody>
    </Sidebar>
  </div>
);


export const CustomSiderbarLink = ({link}: {link:any}) => {
  const router = useRouter();
  const handleClick = async(e: React.MouseEvent)=> {
    if(link.href === '/auth/logout'){
      e.preventDefault();
      try {
        await signOut({
          redirect: false,
          callbackUrl:"/login"
        })
        router.push("/login")
        
      } catch (error) {
        return error
      }
    }
  }
  if(link.href === '/auth/logout'){
    return (
      <button onClick={handleClick} className="flex items-center justify-start gap-2 group/sidebar py-2 rounded-md hover:bg-slate-800 transition-colors w-full text-left">


        {link.icon}
        <span className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
          {link.label}
        </span>
      </button>
    )
  }
  return <SidebarLink link={link} />;

}

export function SidebarDemo() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [allLinks, setAllLinks] = useState(ROLE_BASED_LINKS.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role.toLowerCase();
      setUserRole(role);
      
      const roleLinks = ROLE_BASED_LINKS[role as keyof typeof ROLE_BASED_LINKS] || ROLE_BASED_LINKS.user;
      setAllLinks([...roleLinks, ...COMMON_LINKS]);
    } else if (mounted) {
      setAllLinks([...ROLE_BASED_LINKS.user, ...COMMON_LINKS]);
    }
  }, [session, mounted]);

  if (!mounted) {
    return null;
  }

  if (status === "loading") {
    return <SidebarSkeleton open={open} />;
  }

  if (!session) {
    return (
      <div className={cn("h-screen")}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-slate-900 text-white">
            <div className="flex flex-col flex-1 overflow-hidden">
              {open ? <Logo /> : <LogoIcon />}
              
              <div className="mt-8 flex flex-col items-center justify-center text-center text-slate-400">
                <p className="text-sm">Please log in to access the dashboard</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-xs text-slate-400">?</span>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
    );
  }

  const userName = session.user?.fullName || session.user?.username || "User";

  return (
    <div className={cn("h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-slate-900 text-white">
          <div className="flex flex-col flex-1 overflow-hidden">
            {open ? <Logo /> : <LogoIcon />}
            
            <div className="mt-8 flex flex-col gap-2 text-white">
              {allLinks.map((link, idx) => (
                <CustomSiderbarLink key={`${link.href}-${idx}`} link={link} />
              ))}
            </div>
          </div>
          
          <div className="relative">
            {open ? (
              <Button className="p-[3px] relative w-full bg-transparent hover:bg-transparent">
                <div className="absolute inset-0 bg-gray-400 rounded-lg border-none" />
                <div className="px-8 py-2 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent border-none w-full">
                  {session ? (
                    <Avatar className="h-8 w-8 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200">
                      <AvatarImage>
                        src={session?.user?.profilePicUrl || ""}
                        alt={session?.user?.fullName || ""}
                      </AvatarImage>
                      <AvatarFallback className="text-white test-sm font-medium">
                        {getInitials(session?.user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <CircleUser className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="pl-5">{userName}</span>
                </div>
              </Button>
            ) : (
              <Link href="/profile" className="flex justify-center">
                <div className="p-10 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                {session ? (
                    <Avatar className="h-8 w-8 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200">
                      <AvatarImage>
                        src={session?.user?.profilePicUrl || ""}
                        alt={session?.user?.fullName || ""}
                      </AvatarImage>
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-full text-sm font-medium">
                        {getInitials(session.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <CircleUser className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </Link>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-3 items-center text-sm py-1 relative z-20 group"
    >
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 via-amber-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all duration-300 group-hover:scale-110">
          <Brain className="h-6 w-6 text-white animate-pulse" fill="currentColor" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-emerald-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full animate-pulse delay-500"></div>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white text-xl font-medium whitespace-pre"
      >
        emoHub
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20 group"
    >
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 via-amber-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all duration-300 group-hover:scale-110">
          <Brain className="h-6 w-6 text-white animate-pulse" fill="currentColor" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-emerald-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full animate-pulse delay-500"></div>
      </div>
    </Link>
  );
};