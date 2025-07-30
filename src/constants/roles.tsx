import { IconArrowLeft, IconReport, IconDatabase, IconSettings, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import { FaChartLine, FaRobot, FaUserMd } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { MdAdminPanelSettings, MdEventRepeat, MdHelpOutline, MdOutlineCalendarToday } from "react-icons/md";
import { RiCalendarEventLine, RiEmotionHappyLine, RiMentalHealthFill } from "react-icons/ri";
import { TiGroup } from "react-icons/ti";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { TbWriting, TbTargetArrow } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi";
import { Settings } from "lucide-react";
import { Users } from "lucide-react";
import { Brain } from "lucide-react";
import { Heart } from "lucide-react";
import { Trophy } from "lucide-react";
import { Calendar } from "lucide-react";
import { FileText } from "lucide-react";
import { Users2 } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { User } from "lucide-react";

export const COMMON_LINKS = [
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Help & Support",
      href: "/dashboard/help",
      icon: <MdHelpOutline className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/auth/logout",
      icon: <IconArrowLeft className="text-white h-5 w-5 flex-shrink-0" />,
    },
  ];


export const ROLE_BASED_LINKS = {
  user : [
    {
      label: "Home",
      href: "/dashboard",
      icon: <FaHome className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Emotion Checkins",
      href: "/dashboard/emotioncheckins",
      icon: <RiEmotionHappyLine className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Daily Reflections",
      href: "/dashboard/dailyreflection",
      icon: <TbWriting className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Challenges",
      href: "/dashboard/challenges",
      icon: <TbTargetArrow className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Resources",
      href: "/dashboard/resources",
      icon: <GrResources className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Groups/Community",
      href: "/dashboard/community",
      icon: <HiUserGroup className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Events",
      href: "/dashboard/events",
      icon: <RiCalendarEventLine className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <FaUserCircle className="text-white h-5 w-5 flex-shrink-0" />,
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
  
    admin : [
      {
        label: "Admin Dashboard",
        href: "/dashboard/admin",
        icon: <Settings className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "User Management",
        href: "/dashboard/admin/usermanagement",
        icon: <Users className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "All Emotion Insights",
        href: "/dashboard/emotions",
        icon: <Brain className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Emotion Checkins",
        href: "/dashboard/emotioncheckins",
        icon: <Heart className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Weekly challenges",
        href: "/dashboard/challenges",
        icon: <Trophy className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Daily Reflection",
        href: "/dashboard/reflection",
        icon: <Calendar className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Content Management",
        href: "/dashboard/resources",
        icon: <FileText className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Community Management",
        href: "/dashboard/community",
        icon: <Users2 className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Events Management",
        href: "/dashboard/events",
        icon: <CalendarDays className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: <User className="text-white h-5 w-5 flex-shrink-0" />,
      }
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

















// // Optional: Export tour step configurations for different roles
// export const TOUR_PRIORITIES = {
//   user: [
//     '/dashboard',
//     '/dashboard/emotioncheckins',
//     '/dashboard/challenges',
//     '/dashboard/resources'
//   ],
//   specialist: [
//     '/dashboard',
//     '/dashboard/patients',
//     '/dashboard/appointments',
//     '/dashboard/patient-analytics'
//   ],
//   admin: [
//     '/admin/dashboard',
//     '/dashboard/admin/usermanagement',
//     '/admin/analytics',
//     '/dashboard/resources'
//   ],
//   superadmin: [
//     '/superadmin/dashboard',
//     '/superadmin/overview',
//     '/superadmin/all-users',
//     '/superadmin/platform-analytics'
//   ]
// };