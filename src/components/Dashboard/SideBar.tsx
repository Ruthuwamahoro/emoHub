"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaHome } from "react-icons/fa";
import { BiMessageRounded } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { MdTravelExplore } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { MdEventRepeat } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { MdHelpOutline } from "react-icons/md";
import { Button } from "../ui/button";
import { RiMentalHealthFill } from "react-icons/ri";
import { GrResources } from "react-icons/gr";
import { MdOutlineCalendarToday } from "react-icons/md";
import { MdSchedule } from "react-icons/md";
import { FaRobot } from "react-icons/fa";

export function SidebarDemo() {
  const links = [
    {
        label: "Home Feed",
        href: "/dashboard",
        icon: (
          <FaHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "plan/daily health",
        href: "/dashboard/dayplan",
        icon: (
          <RiMentalHealthFill className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
      label: "Appointments/psychologists",
      href: "/dashboard/appointments",
      icon: (
        < MdOutlineCalendarToday className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Resources",
      href: "#",
      icon: (
        <GrResources  className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Plan your day",
    //   href: "./dayplan",
    //   icon: (
    //     <MdSchedule className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    {
        label: "Groups/Community",
        href: "/dashboard/community",
        icon: (
          <TiGroup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Events",
        href: "#",
        icon: (
          <MdEventRepeat className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Emotions insights",
        href: "/dashboard/emotions",
        icon: (
          <SiGoogleanalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
        label: "Help & Support",
        href: "#",
        icon: (
          <MdHelpOutline className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
      label: "Ask AI",
      href: "./askus",
      icon: (
        <FaRobot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "h-screen", 
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <Button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg  border-none" />
            <div className="px-8 py-2 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent  border-none">
              <div>
                <SidebarLink
                  link={{
                    label: "Manu Arora",
                    href: "#",
                    icon: (
                      <Image
                        src="https://assets.aceternity.com/manu.png"
                        className="h-7 w-7 flex-shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </div>
          </Button>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg- dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        talkHeal
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};