"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import { Brain } from "lucide-react";
import { getInitials } from "./TopNav";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { CircleUser } from "lucide-react";
import { COMMON_LINKS, ROLE_BASED_LINKS } from "@/constants/roles";
import { useRouter } from "next/navigation";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import VibratingHelpButton from "./HelperButton";
import { Avatar as AvatarImages } from "@/utils/genderAvatar";
// npm i react-joyride@next

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

export const CustomSiderbarLink = ({ 
  link, 
  className, 
  dataTour 
}: { 
  link: any; 
  className?: string;
  dataTour?: string;
}) => {
  const router = useRouter();
  
  const handleClick = async (e: React.MouseEvent) => {
    if (link.href === '/auth/logout') {
      e.preventDefault();
      try {
        await signOut({
          redirect: false,
          callbackUrl: "/login"
        });
        router.push("/login");
      } catch (error) {
        return error;
      }
    }
  };

  if (link.href === '/auth/logout') {
    return (
      <button 
        onClick={handleClick} 
        data-tour={dataTour} 
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 rounded-md hover:bg-slate-800 transition-colors w-full text-left",
          className
        )}
      >
        {link.icon}
        <span className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
          {link.label}
        </span>
      </button>
    );
  }
  
  return (
    <div className={className} data-tour={dataTour}>
      <SidebarLink link={link} />
    </div>
  );
};

const generateTourSteps = (userRole: string, allLinks: any[]): Step[] => {
  const baseSteps: Step[] = [
    {
      target: '[data-tour="logo"]',
      content: "Welcome to EmoHub! This is your dashboard where you can manage your emotions and connect with others.",
      disableBeacon: true,
      placement: "bottom-start" as const,
    },
  ];

  const navigationSteps: Step[] = [];
  const TOUR_PRIORITIES = {
    user: [
      '/dashboard',
      '/dashboard/emotioncheckins',
      '/dashboard/challenges',
      '/dashboard/resources'
    ],
    specialist: [
      '/dashboard',
      '/dashboard/patients',
      '/dashboard/appointments',
      '/dashboard/patient-analytics'
    ],
    admin: [
      '/admin/dashboard',
      '/dashboard/admin/usermanagement',
      '/admin/analytics',
      '/dashboard/resources'
    ],
    superadmin: [
      '/superadmin/dashboard',
      '/superadmin/overview',
      '/superadmin/all-users',
      '/superadmin/platform-analytics'
    ]
  };
  
  const priorityLinks = TOUR_PRIORITIES[userRole as keyof typeof TOUR_PRIORITIES] || [];
  
  const mainNavLinks = allLinks.filter(link => {
    const excludedPaths = ['/settings', '/help', '/auth/logout'];
    return !excludedPaths.includes(link.href);
  });
  
  const sortedLinks = mainNavLinks.sort((a, b) => {
    const aPriority = priorityLinks.indexOf(a.href);
    const bPriority = priorityLinks.indexOf(b.href);
    
    if (aPriority === -1 && bPriority === -1) return 0;
    if (aPriority === -1) return 1;
    if (bPriority === -1) return -1;
    return aPriority - bPriority;
  });
  
  sortedLinks.slice(0, 5).forEach((link, index) => {
    const stepContent = getStepContentForLink(link, userRole);
    const tourAttribute = getTourAttributeForLink(link);
    
    if (stepContent) {
      navigationSteps.push({
        target: `[data-tour="${tourAttribute}"]`,
        content: stepContent,
        disableBeacon: true,
        placement: "right" as const,
        spotlightPadding: 4,
      });
    }
  });

  const endSteps: Step[] = [
    {
      target: '[data-tour="profile"]',
      content: "This is your profile section. Click here to view or edit your profile information.",
      disableBeacon: true,
      placement: "top" as const,
      spotlightPadding: 4,
    },
    {
      target: '[data-tour="take-tour"]',
      content: "You can always restart this tour by clicking this help button. Enjoy using EmoHub!",
      disableBeacon: true,
      placement: "top" as const,
      spotlightPadding: 4,
    },
  ];

  return [...baseSteps, ...navigationSteps, ...endSteps];
};

const getStepContentForLink = (link: any, userRole: string): string | null => {
  const contentMap: { [key: string]: string } = {
    '/dashboard': 'Your main dashboard - get an overview of your emotional wellness journey.',
    '/dashboard/emotioncheckins': 'Track your daily emotions and mood patterns here.',
    '/dashboard/challenges': 'Participate in weekly challenges to improve your mental wellness.',
    '/dashboard/resources': 'Access helpful resources, articles, and tools for emotional support.',
    '/dashboard/community': 'Connect with others in supportive community groups.',
    '/dashboard/events': 'Discover upcoming events and activities.',
    '/dashboard/emotions': 'View detailed insights and analytics about your emotional patterns.',
    '/dashboard/askus': 'Get personalized support from our AI assistant.',
    '/dashboard/patients': 'Manage and view your patients (for specialists).',
    '/dashboard/appointments': 'Schedule and manage appointments (for specialists).',
    '/dashboard/patient-analytics': 'View patient progress and analytics (for specialists).',
    '/dashboard/admin/usermanagement': 'Manage system users (for admins).',
    '/admin/analytics': 'View platform analytics and reports (for admins).',
    '/admin/dashboard': 'Your admin control center for managing the platform.',
    '/superadmin/dashboard': 'Super admin panel for system-wide management.',
  };
  
  return contentMap[link.href] || `Navigate to ${link.label} to access this feature.`;
};

const getTourAttributeForLink = (link: any): string => {
  const linkParts = link.href.split('/');
  const lastPart = linkParts[linkParts.length - 1] || 'dashboard';
  return `nav-${lastPart.replace(/[^a-zA-Z0-9]/g, '-')}`;
};

export function SidebarDemo() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [allLinks, setAllLinks] = useState(ROLE_BASED_LINKS.user);
  
  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState<Step[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role.toLowerCase();
      setUserRole(role);
      
      const roleLinks = ROLE_BASED_LINKS[role as keyof typeof ROLE_BASED_LINKS] || ROLE_BASED_LINKS.user;
      const links = [...roleLinks, ...COMMON_LINKS];
      setAllLinks(links);
      
      setTourSteps(generateTourSteps(role, links));
    } else if (mounted) {
      const links = [...ROLE_BASED_LINKS.user, ...COMMON_LINKS];
      setAllLinks(links);
      setTourSteps(generateTourSteps('user', links));
    }
  }, [session, mounted]);

  useEffect(() => {
    if (mounted && session) {
      const hasSeenTour = sessionStorage.getItem(`emohub-tour-${session.user?.id}`);
      if (!hasSeenTour) {
        setTimeout(() => {
          setRunTour(true);
        }, 1500);
      }
    }
  }, [mounted, session]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;
    
    if (typeof tourSteps[index]?.target === 'string' && tourSteps[index]?.target) {
      const element = document.querySelector(tourSteps[index].target);
      if (!element) {
        console.warn(`Tour step ${index}: Element not found for selector: ${tourSteps[index].target}`);
      }
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      if (session?.user?.id) {
        sessionStorage.setItem(`emohub-tour-${session.user.id}`, 'true');
      }
    }
  };

  const startTour = () => {
    setTimeout(() => {
      const missingElements = tourSteps.filter(step => {
        if (!step.target) return false;
        if (typeof step.target === 'string') {
          return !document.querySelector(step.target);
        }
        if (step.target instanceof HTMLElement) {
          return !document.body.contains(step.target);
        }
        return false;
      });
      
      if (missingElements.length > 0) {
        console.warn('Missing tour elements:', missingElements.map(step => step.target));
      }
      
      setRunTour(true);
    }, 500); 
  };

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
    <>
      <div className={cn("h-screen")}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-slate-900 text-white">
          <div className="flex flex-col flex-1 overflow-hidden relative">
              {open ? <Logo /> : <LogoIcon />}
              
              <div className="fixed top-3 left-6 z-50 transition-all duration-300"
              style={{ 
                transform: open ? 'translateX(940px)' : 'translateX(940px)' 
              }}
              data-tour="take-tour">
                <VibratingHelpButton onClick={startTour} />
              </div>
              
              <div className="mt-8 flex flex-col gap-2 text-white">
                {allLinks.map((link, idx) => (
                  <CustomSiderbarLink 
                    key={`${link.href}-${idx}`} 
                    link={link} 
                    className=""
                    dataTour={getTourAttributeForLink(link)}
                  />
                ))}
              </div>
            </div>
            
            <div className="relative" data-tour="profile">
              {open ? (
                <Button className="p-[3px] relative w-full bg-transparent hover:bg-transparent">
                  <div className="absolute inset-0 bg-gray-400 rounded-lg border-none" />
                  <div className="px-8 py-2 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent border-none w-full">
                    {session ? (
                      <Avatar className="cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200 rounded-full">
                        {/* <AvatarImage
                          src={session?.user?.profilePicUrl || ""}
                          alt={session?.user?.fullName || ""}
                        /> */}
                        <AvatarFallback className="text-white test-sm font-medium">
                          {getInitials(session?.user?.username)}
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
                        {/* <AvatarImage
                          src={session?.user?.profilePicUrl || ""}
                          alt={session?.user?.fullName || ""}
                        /> */}
                        <AvatarImages
                        gender={session?.user?.gender || 'other'} 
                        name={session?.user?.username || 'Anonymous'} 
                        size={48}
                      />
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
      
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        debug={true}
        disableOverlayClose={true} 
        disableCloseOnEsc={false}
        hideCloseButton={false}
        scrollToFirstStep={true}
        scrollOffset={100}
        styles={{
          options: {
            primaryColor: '#3b82f6',
            zIndex: 10000,
            arrowColor: '#fff',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
            textColor: '#333',
          },
          tooltip: {
            fontSize: '14px',
            fontFamily: 'inherit',
            borderRadius: '8px',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#fb923c',
            color: 'white',
            fontSize: '14px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
          },
          buttonBack: {
            color: '#6b7280',
            fontSize: '14px',
            marginRight: '10px',
            border: 'none',
            backgroundColor: 'transparent',
          },
          buttonSkip: {
            color: '#6b7280',
            fontSize: '14px',
            border: 'none',
            backgroundColor: 'transparent',
          },
          spotlight: {
            borderRadius: '4px',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish Tour',
          next: 'Next',
          skip: 'Skip Tour',
        }}
      />
    </>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-3 items-center text-sm py-1 relative z-20 group"
      data-tour="logo"
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
      data-tour="logo"
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