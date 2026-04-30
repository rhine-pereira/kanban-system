"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-8 flex items-center justify-between sticky top-0 z-30">
      <MobileNav />
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-blue-600">KanbanSync</h1>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
          <p className="text-xs text-gray-500">{session?.user?.email}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name ?? "User"} 
              className="h-full w-full rounded-full"
            />
          ) : (
            <User className="h-6 w-6 text-blue-600" />
          )}
        </div>
      </div>
    </header>
  );
}
