"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import FeedsComponent from "./FeedsComponent";
import CommunityCreate from "./CommunityCreate";
import MyPostComponent from "./MyPostComponent";

export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  hasReply?: boolean;
}

export default function CommunityComponent() {
  const [activeTab, setActiveTab] = useState("feeds");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search state

  const mainTabs = [
    { key: "feeds", label: "Feeds" },
    { key: "my-post", label: "My Post" },
  ];

  return (
    <div className="lg:pl-6">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 border-b border-l rounded-bl-xl bg-white border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-5">
          {/* Mobile menu button */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-medium text-gray-900">
              Community
            </h1>
          </div>
          <div className="justify-end">
            {/* Create Post Button */}
            <CommunityCreate />
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 lg:z-20 w-64 sm:w-72 
            bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            h-screen overflow-hidden
          `}
        >
          <div className="p-4">
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center mb-4 z-50 lg:hidden">
              <h2 className="text-lg font-medium text-gray-900">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Tabs */}
            <div className="flex justify-around items-center mt-10">
              {mainTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSidebarOpen(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md text-left cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-slate-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {activeTab === "feeds" ? (
            <FeedsComponent searchTerm={searchTerm} />
          ) : (
            <MyPostComponent />
          )}
        </div>
      </div>
    </div>
  );
}
