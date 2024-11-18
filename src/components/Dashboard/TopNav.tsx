"use client";
import React, { useState } from "react";

import { CircleUser, Menu, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { TfiBackLeft } from "react-icons/tfi";
import { FaBackward } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MdNotificationsActive } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import LightDark from "@/components/Dashboard/LightDark";
import { Input } from "@/components/ui/input"

export default function HeaderDashboard() {
  const isLoading = false;

  if (isLoading) {
    return (
      <div>
        <header className="flex bg-white mx-5 mt-2 rounded-[4px] items-center gap-4 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full items-center justify-between flex ">
            <div className="gap-3 flex items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-16 h-4 rounded-md" />
            </div>

            <div className="gap-3 flex items-center">
              <Skeleton className="w-10 h-10 rounded-md" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </header>
      </div>
    );
  }
  return (
    <div>
      <Card className="flex flex-wrap border-none mx-5 mt-2 rounded-[4px] items-center gap-4 px-2 lg:h-[60px] lg:px-6 lg:py-0 dark:bg-[#1e293b] w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              {/* {LeftSideMenuData &&
                LeftSideMenuData?.map((el, index) => (
                  <Link
                    href={el.link}
                    key={index}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-gray-700">
                    {el.icons}
                    {el.name}
                  </Link>
                ))} */}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="w-full flex gap-2 flex-1 pl-2 items-center">
          <FaBackward />
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <div>
                  <Input type="text" placeholder="Search" />
                </div>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div>
            <Button className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="font-semibold text-white">+</span><span className="font-semibold text-white">Create Post</span>
            </Button>
        </div>
        <LightDark />

        <MdNotificationsActive size={30}/>
        <AiFillMessage size={30} />
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
            {/* {session ? (
                <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                    Mahoro Ruth
                </AvatarFallback>
                </Avatar>
            ) : ( */}
                <>
                <CircleUser />
                </>
            {/* )} */}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px] lg:w-[290px]">
            <DropdownMenuLabel className="flex flex-col items-center text-center">
            <div className="text-sm">MyRole</div>
            <div className="mt-2">
                <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                    Kigali
                </AvatarFallback>
                </Avatar>
            </div>
            <div className="text-sm font-semibold mt-2">Myemail</div>
            <div className="text-sm font-semibold mt-2">MyName</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-t border-gray-300" />
            <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="settings">
                <AccordionTrigger className="px-2 py-1.5">
                <div className="flex items-center gap-2 text-blue-600 dark:text-white">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                </div>
                </AccordionTrigger>
                <AccordionContent className="ml-5">
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                    Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Change Password
                </DropdownMenuItem>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <div className="flex w-full items-center justify-start gap-2 text-blue-600 dark:text-white">
                <LogOut />
                <span>Logout</span>
            </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </Card>
      {/* {showChangePasswordForm && (
        <ChangePasswordForm
          onOpen={showChangePasswordForm}
          onClose={handleCloseChangePasswordForm}
        />
      )} */}
    </div>
  );
}

{/* <button className="p-[3px] relative">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    Lit up borders
  </div>
</button> */}




  

      
