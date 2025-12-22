/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import {
  Edit2,
  Eye,
  EyeOff,
  MoreVertical,
  ExternalLink,
  Crown,
  User as UserIcon,
  Trash2Icon,
} from "lucide-react";

import { deleteWidget, getWidgetsByUser } from "../lib/widget.api";
import { toast, Toaster } from "sonner";

interface Widget {
  id: string;
  token: string;
  dbID: string;
  create_at: string;
  profileId: string;
  name: string;
  link: string;
}

type JwtPayload = {
  email?: string;
  sub?: string;
  iat?: number;
  exp?: number;
};

export default function AccountsPage() {
  const router = useRouter();

  /* =======================
     AUTH STATE
  ======================= */
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     WIDGET STATE
  ======================= */
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  /* =======================
     CHECK AUTH
  ======================= */
  useEffect(() => {
    const token = cookies.get("login_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser({ email: decoded.email });
    } catch (e) {
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  /* =======================
     LOAD WIDGETS FROM BE
  ======================= */
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const jwt = cookies.get("login_token");
        if (!jwt) return;

        const res = await getWidgetsByUser(jwt);
        if (res?.success) {
          setWidgets(res.data);
        }
      } catch (e) {
        console.error("LOAD WIDGET ERROR:", e);
      }
    };

    loadWidgets();
  }, []);

  /* =======================
     TOGGLE TOKEN
  ======================= */
  const toggleTokenVisibility = (id: string) => {
    setShowTokens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteWidget = (widgetId: string) => {
    toast.warning("Hapus widget?", {
      description: "Widget yang dihapus tidak bisa dikembalikan.",
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            const res = await deleteWidget(widgetId);

            if (res?.success) {
              setWidgets((prev) =>
                prev.filter((widget) => widget.id !== widgetId)
              );

              toast.success("Widget berhasil dihapus");
            }
          } catch (err) {
            console.error("DELETE WIDGET ERROR:", err);
            toast.error("Gagal menghapus widget");
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  const handleLogout = () => {
    toast.warning("Yakin logout?", {
      description: "Kamu perlu login lagi untuk mengakses dashboard.",
      action: {
        label: "Logout",
        onClick: () => {
          cookies.remove("access_token");
          cookies.remove("login_token");
          cookies.remove("login_email");

          toast.success("Berhasil logout 👋");

          setTimeout(() => {
            router.replace("/auth/login");
          }, 800);
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-12 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Account Details</h1>
          <p className="text-gray-600">Manage your profile and widgets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ================= LEFT ================= */}
          <div className="space-y-6">
            {/* PROFILE */}
            <div className="bg-white border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl">Personal Information</h2>
              </div>

              <div className="space-y-5">
                <div className="border-b pb-4">
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>

                <div className="border-b pb-4">
                  <label className="text-xs text-gray-500">Name</label>
                  <p className="text-gray-400">No name</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">
                    Basic Account
                  </span>
                  <button className="text-purple-600 text-sm flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Upgrade
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-4 rounded-xl border border-red-200 
             text-red-600 py-2 text-sm hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-sm text-gray-600 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl text-purple-600">{widgets.length}</p>
                  <p className="text-xs text-gray-600">Active Widgets</p>
                </div>
                <div>
                  <p className="text-2xl text-purple-600">∞</p>
                  <p className="text-xs text-gray-600">API Calls</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl">Your Widgets</h2>
              <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full">
                {widgets.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {widgets.map((widget) => (
                <div key={widget.id} className="bg-white border rounded-xl p-6">
                  {/* HEADER */}
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                        {widget.id.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-gray-900">
                          {widget.name || "my widget"}
                        </h3>
                        <p className="text-xs text-gray-500">ID: {widget.id}</p>
                      </div>
                    </div>
                    <MoreVertical className="w-4 h-4" />
                    <Trash2Icon
                      className="w-4 h-4"
                      onClick={() => handleDeleteWidget(widget.id)}
                    />
                  </div>

                  {/* TOKEN */}
                  <div className="border-b pb-3 mb-3">
                    <label className="text-xs text-gray-500">
                      Integration Token
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm truncate flex-1">
                        {showTokens[widget.id]
                          ? widget.token
                          : "••••••••••••••••••••••"}
                      </p>
                      <button onClick={() => toggleTokenVisibility(widget.id)}>
                        {showTokens[widget.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* DB */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-500">Database ID</label>
                    <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded truncate">
                      {widget.dbID}
                    </p>
                  </div>

                  {/* LINK */}
                  <a
                    href={widget.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 flex items-center justify-between"
                  >
                    <span className="truncate">{widget.link}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
