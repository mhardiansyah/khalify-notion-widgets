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

  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

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

  const license = {
    key: "e90d011-2302-dc51-8805-f18409C33F",
    expiredAt: "Nov 2, 2025",
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
          {/* ===== TOP SUMMARY ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ACCOUNT */}
            <div className="md:col-span-2 rounded-3xl p-6 bg-white/70 backdrop-blur border shadow-sm">
              {/* USER HEADER */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <UserIcon />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <p className="font-medium text-slate-900">{user?.email}</p>
                </div>

                <span className="px-4 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                  Basic Account
                </span>
              </div>

              {/* LICENSE */}
              <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">
                    🔑
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Your License
                    </p>
                    <p className="text-xs text-slate-500">Basic License Key</p>
                  </div>

                  <span className="text-[11px] px-2 py-1 rounded-full bg-white text-purple-600 border">
                    Active
                  </span>
                </div>

                <div className="bg-white rounded-xl px-4 py-3 border">
                  <p className="text-[11px] text-slate-500 mb-1 flex justify-between">
                    <span>Activated</span>
                    <span className="text-slate-400">{license.expiredAt}</span>
                  </p>

                  <p className="font-mono text-xs text-slate-800 truncate">
                    {license.key}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex items-center justify-between">
                <button className="flex items-center gap-2 text-sm text-purple-600 hover:underline">
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </button>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
              <p className="text-sm opacity-80">Your Stats</p>

              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-3xl font-semibold">{widgets.length}</p>
                  <p className="text-xs opacity-80">Active Widgets</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold">∞</p>
                  <p className="text-xs opacity-80">API Calls</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== WIDGET LIST ===== */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Your Widgets
              </h2>

              <span className="px-4 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                {widgets.length} Active
              </span>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="group rounded-3xl border bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  {/* HEADER */}
                  <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold">
                        {widget.name?.[0]?.toUpperCase() || "W"}
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-900">
                          {widget.name || "My Widget"}
                        </h3>
                        <p className="text-xs text-slate-500 truncate max-w-[180px]">
                          {widget.id}
                        </p>
                      </div>
                    </div>

                    <Trash2Icon
                      onClick={() => handleDeleteWidget(widget.id)}
                      className="w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer"
                    />
                  </div>

                  {/* BODY */}
                  <div className="px-6 pb-6 space-y-4">
                    {/* TOKEN */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Integration Token
                      </p>

                      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                        <p className="font-mono text-xs truncate flex-1">
                          {showTokens[widget.id]
                            ? widget.token
                            : "••••••••••••••••••"}
                        </p>

                        <button
                          onClick={() => toggleTokenVisibility(widget.id)}
                        >
                          {showTokens[widget.id] ? (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* DB */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Database ID</p>
                      <p className="font-mono text-xs bg-slate-50 rounded-xl px-3 py-2 truncate">
                        {widget.dbID}
                      </p>
                    </div>

                    {/* LINK */}
                    <a
                      href={widget.link}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm text-purple-600 hover:underline"
                    >
                      View Widget
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
