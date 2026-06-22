"use client";
import Sidebar from "@/components/pages/dashboardLayout/sidebar";
import TopNav from "@/components/pages/dashboardLayout/top-nav";
import Footer from "@/components/shared/Footer/Footer";
import WithCompanyProvider from "@/components/shared/role-wrappers/WithCompanyProvider";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <WithCompanyProvider>
      <div className="flex flex-col h-screen">
        <TopNav
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
          <main className="flex-1 overflow-auto bg-gray-50 scroll-none">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </WithCompanyProvider>
  );
}
