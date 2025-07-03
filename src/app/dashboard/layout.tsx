
import type { Metadata } from "next";
import HeaderDashboard from "@/components/Dashboard/TopNav";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { SessionProvider } from "@/utils/providers/sessionProvider";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { options } from "@/auth";
import { SidebarDemo } from "@/components/Dashboard/SideBar";


export const metadata: Metadata = {
  title: "emoHub Dashboard",
  description: "emotional support platform dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <SessionProvider session={session}>
          <ReactQueryProvider>
            <Toaster position="top-right" />
            <div className="flex h-screen w-screen overflow-hidden">
              <SidebarDemo />
              <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <HeaderDashboard />
                <div className="flex flex-1 overflow-hidden">
                  <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-amber-50 via-white to-orange-50">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}