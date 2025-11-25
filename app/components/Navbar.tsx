"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { Home, Settings, HelpCircle, User } from "lucide-react";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    { id: "/home", label: "Welcome", icon: Home },
    { id: "/widgets/create", label: "Setup", icon: Settings },
    { id: "/help", label: "Help", icon: HelpCircle },
    { id: "/account", label: "Account", icon: User },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };
    loadUser();
  }, []);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {userEmail ? userEmail[0].toUpperCase() : "?"}
              </span>
            </div>

            <div>
              <h1 className="text-md font-semibold text-gray-900">
                {userEmail ?? "Loading..."}
              </h1>
              <p className="text-xs text-purple-600 -mt-1">
                Instagram Grid Preview
              </p>
            </div>
          </div>

          {/* NAV MENU */}
          <nav>
            <ul className="flex items-center gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.id);

                return (
                  <li key={item.id}>
                    <Link
                      href={item.id}
                      className={`group relative flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                        isActive ? "text-purple-600" : "text-gray-600"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? "text-purple-600"
                            : "text-gray-400 group-hover:text-purple-600"
                        }`}
                      />

                      <span>{item.label}</span>

                      {/* UNDERLINE ANIMATION */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] w-full bg-purple-600 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                          isActive ? "scale-x-100" : ""
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* FOOTER */}
          <div className="text-right leading-tight">
            <p className="text-xs text-gray-500">Made with ❤️ by</p>
            <p className="text-sm text-gray-900 font-semibold">@rainbowgrow</p>
          </div>
        </div>
      </div>
    </header>
  );
}
