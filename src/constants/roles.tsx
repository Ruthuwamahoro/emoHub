import { IconArrowLeft, IconReport, IconDatabase, IconSettings, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import { FaChartLine, FaHome, FaRobot, FaUserMd } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { MdAdminPanelSettings, MdEventRepeat, MdHelpOutline, MdOutlineCalendarToday } from "react-icons/md";
import { RiMentalHealthFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { TiGroup } from "react-icons/ti";

export const COMMON_LINKS = [
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


export const ROLE_BASED_LINKS = {
    user: [
      {
        label: "Home",
        href: "/dashboard",
        icon: <FaHome className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Emotion Checkins",
        href: "/dashboard/emotioncheckins",
        icon: <RiMentalHealthFill className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Daily Reflections",
        href: "/dashboard/dailyreflection",
        icon: <RiMentalHealthFill className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Challenges",
        href: "/dashboard/challenges",
        icon: <MdAdminPanelSettings className="text-white h-5 w-5 flex-shrink-0" />,
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
        href: "/dashboard/admin",
        icon: <MdAdminPanelSettings className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "User Management",
        href: "/dashboard/admin/usermanagement",
        icon: <IconUsers className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Emotion Insights",
        href: "/dashboard/emotions",
        icon: <RiMentalHealthFill className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Weekly challenges",
        href: "/dashboard/challenges",
        icon: <MdAdminPanelSettings className="text-white h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Daily Reflection",
        href: "/dashboard/reflection",
        icon: <MdOutlineCalendarToday className="text-white h-5 w-5 flex-shrink-0" />,
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
        href: "/dashboard/community",
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