"use client";

import { useState } from "react";
import { Menu, X, Kanban, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Board", href: "/board", icon: Kanban },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white animate-in slide-in-from-left duration-300">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="p-6">
              <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <Kanban className="h-6 w-6" />
                KanbanSync
              </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn("h-6 w-6", isActive ? "text-blue-600" : "text-gray-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 w-full px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-6 w-6 text-gray-400" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
