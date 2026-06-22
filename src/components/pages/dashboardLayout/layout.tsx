"use client";

import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar
        closeSidebar={() => setIsSidebarOpen(false)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-b border-gray-200">
          <TopNav
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </header>

        <main className="flex-1 overflow-auto p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
