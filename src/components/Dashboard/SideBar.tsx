"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconSettings,
  IconUsers,
  IconShieldCheck,
  IconReport,
  IconDatabase,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaHome, FaRobot, FaUserMd, FaChartLine } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { MdEventRepeat, MdHelpOutline, MdOutlineCalendarToday, MdAdminPanelSettings } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { Button } from "../ui/button";
import { RiMentalHealthFill } from "react-icons/ri";
import { GrResources } from "react-icons/gr";
import { useSession } from "next-auth/react";
import { Brain } from "lucide-react";

const roleBasedLinks = {
  user: [
    {
      label: "Home",
      href: "/dashboard",
      icon: <FaHome className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Plan/Daily Health",
      href: "/dashboard/dayplan",
      icon: <RiMentalHealthFill className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Appointments",
      href: "/dashboard/appointments",
      icon: <MdOutlineCalendarToday className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Resources",
      href: "/dashboard/resources",
      icon: <GrResources className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Groups/Community",
      href: "/dashboard/community",
      icon: <TiGroup className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Events",
      href: "/dashboard/events",
      icon: <MdEventRepeat className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Emotions Insights",
      href: "/dashboard/emotions",
      icon: <SiGoogleanalytics className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Ask AI",
      href: "/dashboard/askus",
      icon: <FaRobot className="text-white h-5 w-5 flex-shrink-0" />,
    },
  ],

  specialist: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <FaHome className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "My Patients",
      href: "/dashboard/patients",
      icon: <IconUsers className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Appointments",
      href: "/dashboard/appointments",
      icon: <MdOutlineCalendarToday className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Treatment Plans",
      href: "/dashboard/treatment-plans",
      icon: <FaUserMd className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Patient Analytics",
      href: "/dashboard/patient-analytics",
      icon: <FaChartLine className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Resources",
      href: "/dashboard/resources",
      icon: <GrResources className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Professional Groups",
      href: "/dashboard/pro-community",
      icon: <TiGroup className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Events & Training",
      href: "/dashboard/events",
      icon: <MdEventRepeat className="text-white h-5 w-5 flex-shrink-0" />,
    },
  ],

  admin: [
    {
      label: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: <MdAdminPanelSettings className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "User Management",
      href: "/admin/users",
      icon: <IconUsers className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Specialist Management",
      href: "/admin/specialists",
      icon: <FaUserMd className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Content Management",
      href: "/dashboard/resources",
      icon: <GrResources className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Analytics & Reports",
      href: "/admin/analytics",
      icon: <IconReport className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Community Management",
      href: "/admin/community",
      icon: <TiGroup className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Events Management",
      href: "/admin/events",
      icon: <MdEventRepeat className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "System Settings",
      href: "/admin/settings",
      icon: <IconSettings className="text-white h-5 w-5 flex-shrink-0" />,
    },
  ],

  superadmin: [
    {
      label: "Super Admin Panel",
      href: "/superadmin/dashboard",
      icon: <IconShieldCheck className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "System Overview",
      href: "/superadmin/overview",
      icon: <IconDatabase className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Admin Management",
      href: "/superadmin/admins",
      icon: <MdAdminPanelSettings className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "All Users",
      href: "/superadmin/all-users",
      icon: <IconUsers className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Platform Analytics",
      href: "/superadmin/platform-analytics",
      icon: <IconReport className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "System Configuration",
      href: "/superadmin/config",
      icon: <IconSettings className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Security Logs",
      href: "/superadmin/security",
      icon: <IconShieldCheck className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Database Management",
      href: "/superadmin/database",
      icon: <IconDatabase className="text-white h-5 w-5 flex-shrink-0" />,
    },
  ],
};

const commonLinks = [
  {
    label: "Settings",
    href: "/settings",
    icon: <IconSettings className="text-white h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Help & Support",
    href: "/help",
    icon: <MdHelpOutline className="text-white h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: "/auth/logout",
    icon: <IconArrowLeft className="text-white h-5 w-5 flex-shrink-0" />,
  },
];

// Loading skeleton component
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

export function SidebarDemo() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [allLinks, setAllLinks] = useState(roleBasedLinks.user);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update role and links when session changes
  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role.toLowerCase();
      setUserRole(role);
      
      const roleLinks = roleBasedLinks[role as keyof typeof roleBasedLinks] || roleBasedLinks.user;
      setAllLinks([...roleLinks, ...commonLinks]);
    } else if (mounted) {
      // Default to user role if no session but component is mounted
      setAllLinks([...roleBasedLinks.user, ...commonLinks]);
    }
  }, [session, mounted]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (status === "loading") {
    return <SidebarSkeleton open={open} />;
  }

  // Show login prompt if no session
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
  const userImage = session.user?.profilePicUrl || "https://assets.aceternity.com/manu.png";

  return (
    <div className={cn("h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-slate-900 text-white">
          <div className="flex flex-col flex-1 overflow-hidden">
            {open ? <Logo /> : <LogoIcon />}
            
            <div className="mt-8 flex flex-col gap-2 text-white">
              {allLinks.map((link, idx) => (
                <SidebarLink key={`${link.href}-${idx}`} link={link} />
              ))}
            </div>
          </div>
          
          <div className="relative">
            {open ? (
              <Button className="p-[3px] relative w-full bg-transparent hover:bg-transparent">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg border-none" />
                <div className="px-8 py-2 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent border-none w-full">
                  <SidebarLink
                    link={{
                      label: userName,
                      href: "/profile",
                      icon: (
                        <Image
                          src={userImage}
                          className="h-7 w-7 flex-shrink-0 rounded-full"
                          width={50}
                          height={50}
                          alt={`${userName} avatar`}
                        />
                      ),
                    }}
                  />
                </div>
              </Button>
            ) : (
              <Link href="/profile" className="flex justify-center">
                <div className="p-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <Image
                    src={userImage}
                    className="h-8 w-8 rounded-full"
                    width={32}
                    height={32}
                    alt={`${userName} avatar`}
                    title={userName}
                  />
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