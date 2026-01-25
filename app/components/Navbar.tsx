"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, HelpCircle, User } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

type JwtPayload = {
  email?: string;
};

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    { id: "/home", label: "Home", icon: Home },
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
        {/* WRAPPER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* LEFT - LOGO */}
          <div className="flex justify-center md:justify-start">
            <Link href="/home" className="flex items-center">
              <Image
                src="/logo-primary.png"
                alt="Logo"
                width={140}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* NAV MENU */}
          <nav className="flex justify-center overflow-hidden">
            <ul className="flex flex-nowrap items-center gap-1 md:gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.id);

                return (
                  <li key={item.id} className="shrink-0">
                    <Link
                      href={item.id}
                      className={`flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2
              px-2 py-1 md:px-4 md:py-2
              rounded-lg transition-all
              text-[11px] md:text-sm
              ${
                isActive
                  ? "bg-purple-50 text-purple-600 ring-1 ring-purple-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
                    >
                      <Icon
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          isActive ? "text-purple-600" : "text-gray-400"
                        }`}
                      />
                      <span className="leading-none">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
