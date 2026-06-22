"use client";

import {
  Bell,
  BookUser,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Hospital,
  Menu,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const sidebarItems = [
    {
      title: "Facility Information",
      items: [
        {
          icon: Hospital,
          label: "Facility Profile",
          link: "/facility/profile",
        },
        {
          icon: BookUser,
          label: "HR Details",
          link: "/facility/profile/hr_details",
        },
        { icon: Star, label: "Reviews", link: "/facility/profile/reviews" },
        {
          icon: TrendingUp,
          label: "Promotions Management",
          link: "/facility/profile/promotions_management",
        },
        {
          icon: CreditCard,
          label: "Manage Plan",
          link: "/facility/profile/manage_plan",
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          link: "/facility/profile/notifications",
        },
        {
          icon: FileText,
          label: "Legal and Policies",
          link: "/facility/profile/legal_policies",
        },
        {
          icon: HelpCircle,
          label: "Help & Support",
          link: "/facility/profile/help_support",
        },
      ],
    },
  ];

  // Find the active menu based on pathname initially
  const [activeMenu, setActiveMenu] = useState<string>(() => {
    for (const section of sidebarItems) {
      for (const item of section.items) {
        if (pathname === item.link) {
          return item.label;
        }
      }
    }
    return ""; // fallback
  });

  return (
    <div className="bg-gray-50">
      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            w-64 sm:w-72 bg-white border-r border-gray-200
            transform ${
              sidebarOpen
                ? "translate-x-0 h-screen "
                : "-translate-x-full h-screen sm:h-[calc(100vh-75px)]"
            }
            lg:translate-x-0 transition-transform duration-300 ease-in-out
          `}
        >
          <div className="p-4 sm:p-6">
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Profile
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar menu */}
            <div className="space-y-4">
              {sidebarItems.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = activeMenu === item.label;

                      return (
                        <div
                          key={itemIndex}
                          className={`flex items-center justify-between p-2 sm:p-2.5 rounded-md cursor-pointer transition-colors duration-200 ${
                            isActive ? "bg-[#14b8a6]" : "hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setSidebarOpen(false);
                            setActiveMenu(item.label);
                            router.push(item.link);
                          }}
                        >
                          <div className="flex items-center min-w-0">
                            <Icon
                              className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isActive ? "text-white" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm truncate ${
                                isActive ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 flex-shrink-0 ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 mr-2 rounded-md text-gray-600 hover:bg-gray-100 flex-shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {activeMenu}
                </h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100vh-150px)] overflow-y-auto scroll-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
