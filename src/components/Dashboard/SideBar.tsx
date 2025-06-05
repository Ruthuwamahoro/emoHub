// "use client";
// import React, { useState } from "react";
// import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
// import {
//   IconArrowLeft,
//   IconSettings,
// } from "@tabler/icons-react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { FaHome } from "react-icons/fa";
// import { TiGroup } from "react-icons/ti";
// import { MdEventRepeat } from "react-icons/md";
// import { SiGoogleanalytics } from "react-icons/si";
// import { MdHelpOutline } from "react-icons/md";
// import { Button } from "../ui/button";
// import { RiMentalHealthFill } from "react-icons/ri";
// import { GrResources } from "react-icons/gr";
// import { MdOutlineCalendarToday } from "react-icons/md";
// import { FaRobot } from "react-icons/fa";
// import { useSession } from "next-auth/react";


// export function SidebarDemo() {
//   const {data: session} = useSession();
//   console.log("dataaaaaakikiiiii=========================================", session);
//   const links = [
//     {
//         label: "Home Feed",
//         href: "/dashboard",
//         icon: (
//           <FaHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//         ),
//     },
//     {
//         label: "plan/daily health",
//         href: "/dashboard/dayplan",
//         icon: (
//           <RiMentalHealthFill className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//         ),
//     },
//     {
//       label: "Appointments/psychologists",
//       href: "/dashboard/appointments",
//       icon: (
//         < MdOutlineCalendarToday className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//       ),
//     },
//     {
//       label: "Resources",
//       href: "#",
//       icon: (
//         <GrResources  className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//       ),
//     },
//     // {
//     //   label: "Plan your day",
//     //   href: "./dayplan",
//     //   icon: (
//     //     <MdSchedule className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//     //   ),
//     // },
//     {
//         label: "Groups/Community",
//         href: "/dashboard/community",
//         icon: (
//           <TiGroup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//         ),
//     },
//     {
//         label: "Events",
//         href: "#",
//         icon: (
//           <MdEventRepeat className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//         ),
//     },
//     {
//         label: "Emotions insights",
//         href: "/dashboard/emotions",
//         icon: (
//           <SiGoogleanalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//         ),
//     },
    
//     {
//       label: "Settings",
//       href: "#",
//       icon: (
//         <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//       ),
//     },
//     {
//         label: "Help & Support",
//         href: "#",
//         icon: (
//           <MdHelpOutline className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//         ),
//     },
//     {
//       label: "Ask AI",
//       href: "./askus",
//       icon: (
//         <FaRobot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//       ),
//     },
//     {
//       label: "Logout",
//       href: "#",
//       icon: (
//         <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//       ),
//     },
//   ];
//   const [open, setOpen] = useState(false);
//   return (
//     <div
//       className={cn(
//         "h-screen", 
//       )}
//     >
//       <Sidebar open={open} setOpen={setOpen}>
//         <SidebarBody className="justify-between gap-10">
//           <div className="flex flex-col flex-1 overflow-hidden">
//             {open ? <Logo /> : <LogoIcon />}
//             <div className="mt-8 flex flex-col gap-2">
//               {links.map((link, idx) => (
//                 <SidebarLink key={idx} link={link} />
//               ))}
//             </div>
//           </div>
//           <Button className="p-[3px] relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg  border-none" />
//             <div className="px-8 py-2 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent  border-none">
//               <div>
//                 <SidebarLink
//                   link={{
//                     label: "Manu Arora",
//                     href: "#",
//                     icon: (
//                       <Image
//                         src="https://assets.aceternity.com/manu.png"
//                         className="h-7 w-7 flex-shrink-0 rounded-full"
//                         width={50}
//                         height={50}
//                         alt="Avatar"
//                       />
//                     ),
//                   }}
//                 />
//               </div>
//             </div>
//           </Button>
//         </SidebarBody>
//       </Sidebar>
//     </div>
//   );
// }
// export const Logo = () => {
//   return (
//     <Link
//       href="#"
//       className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
//     >
//       <div className="h-5 w-6 bg- dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
//       <motion.span
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="font-medium text-black dark:text-white whitespace-pre"
//       >
//         emoHub
//       </motion.span>
//     </Link>
//   );
// };
// export const LogoIcon = () => {
//   return (
//     <Link
//       href="#"
//       className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
//     >
//       <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
//     </Link>
//   );
// };

"use client";
import React, { useState } from "react";
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

// Define role-based link configurations
const roleBasedLinks = {
  // Regular User Links
  user: [
    {
      label: "Home Feed",
      href: "/dashboard",
      icon: <FaHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Plan/Daily Health",
      href: "/dashboard/dayplan",
      icon: <RiMentalHealthFill className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Appointments",
      href: "/dashboard/appointments",
      icon: <MdOutlineCalendarToday className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Resources",
      href: "/dashboard/resources",
      icon: <GrResources className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Groups/Community",
      href: "/dashboard/community",
      icon: <TiGroup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Events",
      href: "/dashboard/events",
      icon: <MdEventRepeat className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Emotions Insights",
      href: "/dashboard/emotions",
      icon: <SiGoogleanalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Ask AI",
      href: "/dashboard/askus",
      icon: <FaRobot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ],

  // Specialist/Psychologist Links
  specialist: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <FaHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "My Patients",
      href: "/dashboard/patients",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Appointments",
      href: "/dashboard/appointments",
      icon: <MdOutlineCalendarToday className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Treatment Plans",
      href: "/dashboard/treatment-plans",
      icon: <FaUserMd className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Patient Analytics",
      href: "/dashboard/patient-analytics",
      icon: <FaChartLine className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Resources",
      href: "/dashboard/resources",
      icon: <GrResources className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Professional Groups",
      href: "/dashboard/pro-community",
      icon: <TiGroup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Events & Training",
      href: "/dashboard/events",
      icon: <MdEventRepeat className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ],

  // Admin Links
  admin: [
    {
      label: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: <MdAdminPanelSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "User Management",
      href: "/admin/users",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Specialist Management",
      href: "/admin/specialists",
      icon: <FaUserMd className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Content Management",
      href: "/admin/content",
      icon: <GrResources className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Analytics & Reports",
      href: "/admin/analytics",
      icon: <IconReport className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Community Management",
      href: "/admin/community",
      icon: <TiGroup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Events Management",
      href: "/admin/events",
      icon: <MdEventRepeat className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "System Settings",
      href: "/admin/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ],

  // Super Admin Links
  superadmin: [
    {
      label: "Super Admin Panel",
      href: "/superadmin/dashboard",
      icon: <IconShieldCheck className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "System Overview",
      href: "/superadmin/overview",
      icon: <IconDatabase className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Admin Management",
      href: "/superadmin/admins",
      icon: <MdAdminPanelSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "All Users",
      href: "/superadmin/all-users",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Platform Analytics",
      href: "/superadmin/platform-analytics",
      icon: <IconReport className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "System Configuration",
      href: "/superadmin/config",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Security Logs",
      href: "/superadmin/security",
      icon: <IconShieldCheck className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Database Management",
      href: "/superadmin/database",
      icon: <IconDatabase className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ],
};

// Common links for all roles
const commonLinks = [
  {
    label: "Settings",
    href: "/settings",
    icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Help & Support",
    href: "/help",
    icon: <MdHelpOutline className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: "/auth/logout",
    icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
];

export function SidebarDemo() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="h-screen w-64 bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  // Handle no session
  if (!session) {
    return (
      <div className="h-screen w-64 bg-gray-100 dark:bg-gray-800">
        <div className="p-4">Please log in</div>
      </div>
    );
  }

  console.log("Session data:", session.user?.role);

  // Get user role from session (normalize to lowercase)
  const userRole = session.user?.role?.toLowerCase() || 'user';

  
  // Get role-specific links, fallback to user links if role not found
  const roleLinks = roleBasedLinks[userRole as keyof typeof roleBasedLinks] || roleBasedLinks.user;
  
  // Combine role-specific links with common links
  const allLinks = [...roleLinks, ...commonLinks];

  // Get user display info
  const userName = session.user?.fullName || session.user?.username || "User";
  const userImage = session.user?.profilePicUrl || "https://assets.aceternity.com/manu.png";

  return (
    <div className={cn("h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-hidden">
            {open ? <Logo /> : <LogoIcon />}
            
            {/* Role Badge */}
            {open && (
              <div className="mt-2 px-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full capitalize">
                  {userRole}
                </span>
              </div>
            )}
            
            <div className="mt-8 flex flex-col gap-2">
              {allLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          
          {/* User Profile Button */}
          <Button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg border-none" />
            <div className="px-8 py-2 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent border-none">
              <div>
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
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
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
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};