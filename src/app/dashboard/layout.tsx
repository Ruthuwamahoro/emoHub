import type { Metadata } from "next";
import "./globals.css";
import HeaderDashboard from "@/components/Dashboard/TopNav";
import { SidebarDemo } from "@/components/Dashboard/SideBar";
import { RightSidebar } from "@/components/Dashboard/RightSideBar";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { SessionProvider } from "@/utils/providers/sessionProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "HealthMind Dashboard",
  description: "Mental health support platform dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <SessionProvider>
          <ReactQueryProvider>
            <Toaster position="top-right" />
            <div className="flex h-screen w-screen overflow-hidden">
              {/* Left Sidebar */}
              <SidebarDemo />
              
              {/* Main Content Area */}
              <div className="flex flex-col flex-1 h-screen overflow-hidden">
                {/* Top Header */}
                <HeaderDashboard />
                
                {/* Content Area with Right Sidebar */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Main Content */}
                  <main className="flex-1 overflow-y-auto p-6">
                    {children}
                  </main>
                  
                  {/* Right Sidebar */}
                  <RightSidebar />
                </div>
              </div>
            </div>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}