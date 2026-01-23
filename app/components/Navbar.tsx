"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, HelpCircle, User } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
type JwtPayload = {
  email?: string;
};

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    { id: "/home", label: "home", icon: Home },
    { id: "/widgets/create", label: "Setup", icon: Settings },
    { id: "/helps", label: "Help", icon: HelpCircle },
    { id: "/accounts", label: "Account", icon: User },
  ];

  useEffect(() => {
    const token = Cookies.get("login_token");

    if (!token) {
      setUserEmail(null);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUserEmail(decoded.email ?? null);
    } catch (e) {
      console.error("Invalid JWT", e);
      setUserEmail(null);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {userEmail ? userEmail[0].toUpperCase() : "?"}
              </span>
            </div>

            <div>
              <h1 className="text-md font-semibold text-gray-900">
                {userEmail ?? "Guest"}
              </h1>
              <p className="text-xs text-purple-600 -mt-1">
                Instagram Grid Preview
              </p>
            </div>
          </div>

          {/* NAV MENU */}
          <nav className="absolute left-1/2 -translate-x-1/2">

            <ul className="flex items-center gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.id);

                return (
                  <li key={item.id}>
                    <Link
                      href={item.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
                        ${
                          isActive
                            ? "bg-purple-50 text-purple-600 ring-1 ring-purple-200"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-purple-600" : "text-gray-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* FOOTER */}
          {/* <div className="text-right leading-tight">
            <p className="text-xs text-gray-500">Made with ❤️ by</p>
            <p className="text-sm text-gray-900 font-semibold">@rainbowgrow</p>
          </div> */}
        </div>
      </div>
    </header>
  );  
}
