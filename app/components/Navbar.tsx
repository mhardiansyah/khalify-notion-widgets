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
    { id: "/", label: "Home", icon: Home },
    { id: "/widgets/create", label: "Setup", icon: Settings },
    { id: "/helps", label: "Help", icon: HelpCircle },
    { id: "/accounts", label: "Account", icon: User },
  ];

  useEffect(() => {
    const token = Cookies.get("login_token");

    if (!token) return setUserEmail(null);

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUserEmail(decoded.email ?? null);
    } catch {
      setUserEmail(null);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-4">
        {/* WRAPPER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          
          {/* LOGO */}
          <div className="flex justify-center md:justify-start mt-1 md:mt-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-primary.png"
                alt="Logo"
                width={170} // 👈 logo dibesarin (mobile)
                height={48}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* NAV */}
          <nav className="flex justify-center">
            <ul className="flex items-center gap-2 md:gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.id === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.id);

                return (
                  <li key={item.id}>
                    <Link
                      href={item.id}
                      className={`flex items-center justify-center
                        w-11 h-11 md:w-auto md:h-auto
                        md:px-4 md:py-2
                        rounded-xl transition
                        ${
                          isActive
                            ? "bg-purple-50 text-purple-600"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <Icon
                        className={`w-6 h-6 md:w-5 md:h-5 ${
                          isActive ? "text-purple-600" : "text-gray-400"
                        }`}
                      />

                      {/* LABEL HIDDEN DI MOBILE */}
                      <span className="hidden md:inline ml-2 text-sm">
                        {item.label}
                      </span>
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
