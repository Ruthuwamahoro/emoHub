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
import HeaderDashboard from "./TopNav";
import { Button } from "../ui/button";
import { MeteorsDemo } from "./Posts";

export function SidebarDemo() {
  const links = [
    {
        label: "Home Feed",
        href: "#",
        icon: (
          <FaHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
        label: "Messages",
        href: "#",
        icon: (
          <BiMessageRounded className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Notifications",
        href: "#",
        icon: (
          <IoNotifications className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },

    {
        label: "Explore",
        href: "#",
        icon: (
          <MdTravelExplore className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Groups/Community",
        href: "#",
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
        label: "Analytics",
        href: "#",
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
        "rounded-md flex flex-col md:flex-row  w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
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
      <Dashboard />
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

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 border-none bg-white  flex flex-col gap-2 flex-1 w-full h-full">
          {/* <HeaderDashboard /> */}
          <div className="flex w-3/4">
            <div className="flex">
              <MeteorsDemo />
              <MeteorsDemo />
              <MeteorsDemo />
            </div>
            <div className="bg-red-300 w-1/4 absolute right-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero ipsa voluptatibus accusamus voluptate aspernatur! Facilis, sed voluptates. Culpa iusto molestias ipsa excepturi nostrum, error suscipit nam earum tempora dignissimos numquam rerum aliquam a, eligendi ut repellendus voluptatum in exercitationem dolor eum minus, quaerat soluta odit. Cumque asperiores consectetur corporis rem quis quisquam fugiat officia. Debitis ad, fugit, molestias voluptate pariatur nemo alias cumque illo, error facere ratione harum culpa saepe minus officia quaerat enim nam iure magnam exercitationem sit voluptatum quidem aut ea. Qui, quidem fugiat! Dignissimos officiis officia odio accusantium placeat? Expedita sit, quae placeat explicabo suscipit cupiditate unde?
            </div>
          </div>
          </div>
    </div>
  );
};
