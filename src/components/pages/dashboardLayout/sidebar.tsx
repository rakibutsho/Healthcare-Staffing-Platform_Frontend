"use client";

import { Button } from "@/components/ui/buttons/button/Button";
import { useGetProviderProfileQuery } from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { logoutHandler } from "@/utils/handleLogout";
import { Avatar } from "antd";
import {
  Calendar,
  Home,
  LogOut,
  MessageCircleMore,
  MessageSquare,
  SquareUser,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, closeSidebar }: SidebarProps) {
  const role = useAppSelector(selectCurrentUser)?.role || "PROVIDER";

  const { data } = useGetProviderProfileQuery("", {
    refetchOnMountOrArgChange: true,
  });

  const userData = data?.result;

  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  // Sidebar items filtered by role
  const sidebarItems = [
    // Facility
    { icon: Home, label: "Home", href: "/facility", roles: ["FACILITY"] },
    {
      icon: Calendar,
      label: "Schedule",
      href: "/facility/schedule",
      roles: ["FACILITY"],
    },
    {
      icon: SquareUser,
      label: "Providers",
      href: "/facility/providers",
      roles: ["FACILITY"],
    },
    {
      icon: MessageCircleMore,
      label: "Chat",
      href: "/facility/messages",
      roles: ["FACILITY"],
    },
    {
      icon: User,
      label: "Profile",
      href: "/facility/profile",
      roles: ["FACILITY"],
    },

    // Provider
    { icon: Home, label: "Home", href: "/dashboard", roles: ["PROVIDER"] },
    {
      icon: Calendar,
      label: "Schedule",
      href: "/dashboard/schedule",
      roles: ["PROVIDER"],
    },
    {
      icon: Users,
      label: "Community",
      href: "/dashboard/community",
      roles: ["PROVIDER"],
    },
    {
      icon: MessageSquare,
      label: "Messages",
      href: "/dashboard/messages",
      roles: ["PROVIDER"],
    },
    {
      icon: User,
      label: "Profile",
      href: "/dashboard/profile",
      roles: ["PROVIDER"],
    },
  ].filter((item) => item.roles.includes(role));

  const isActive = (href: string) => pathname === href;

  const userName = () => {
    switch (role) {
      case "FACILITY":
        return userData?.facilityProfile?.facilityName || userData?.fullName;
      case "PROVIDER":
        return userData?.fullName;
      default:
        return userData?.fullName;
    }
  };

  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-semibold text-gray-800">
                AnesthLink
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col justify-center items-center mb-8">
              <Avatar size={150} className="bg-gray-400 text-white">
                <div className="w-37.5 h-37.5 rounded-full overflow-hidden border">
                  <Image
                    src={
                      userData?.providerProfile?.profileImage ||
                      userData?.profileImage ||
                      "/default-avatar.png"
                    }
                    alt={userData?.fullName || "Profile"}
                    width={150}
                    height={150}
                    className="rounded-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "/default-avatar.png")
                    }
                  />
                </div>
              </Avatar>
              <div className="pt-2 text-center">
                <div className="font-semibold text-gray-800">{userName()}</div>
                {/* <div className="text-sm text-gray-500">
                  {userData?.providerProfile?.address?.fullAddress || "N/A"}
                </div> */}
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive(item.href)
                      ? "bg-teal-700 text-white"
                      : "text-gray-600 hover:bg-teal-700 hover:text-white"
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) closeSidebar();
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout button */}
          <div className="px-6 py-3 border-t border-gray-200">
            <div
              className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => {
                handleLogout();
                if (window.innerWidth < 1024) closeSidebar();
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
