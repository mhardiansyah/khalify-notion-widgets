/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import {
  Eye,
  EyeOff,
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
};

export default function AccountsPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});

  /* ================= PRO / FREE LOGIC ================= */
  const isPro = false; // nanti ambil dari backend / JWT
  const FREE_WIDGET_LIMIT = 1;

  const isWidgetPaused = (index: number) =>
    !isPro && index >= FREE_WIDGET_LIMIT;

  const disabledClass = "opacity-50 pointer-events-none select-none";

  /* ================= AUTH ================= */
  useEffect(() => {
    const token = cookies.get("login_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser({ email: decoded.email });
    } catch {
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  /* ================= LOAD WIDGETS ================= */
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const jwt = cookies.get("login_token");
        if (!jwt) return;

        const res = await getWidgetsByUser(jwt);
        if (res?.success) setWidgets(res.data);
      } catch (e) {
        console.error("LOAD WIDGET ERROR:", e);
      }
    };

    loadWidgets();
  }, []);

  /* ================= HANDLERS ================= */
  const toggleTokenVisibility = (id: string) =>
    setShowTokens((p) => ({ ...p, [id]: !p[id] }));

  const toggleDetails = (id: string) =>
    setOpenDetails((p) => ({ ...p, [id]: !p[id] }));

  const handleDeleteWidget = (widgetId: string) => {
    toast.warning("Hapus widget?", {
      description: "Widget yang dihapus tidak bisa dikembalikan.",
      action: {
        label: "Hapus",
        onClick: async () => {
          const res = await deleteWidget(widgetId);
          if (res?.success) {
            setWidgets((p) => p.filter((w) => w.id !== widgetId));
            toast.success("Widget berhasil dihapus");
          }
        },
      },
      cancel: { label: "Batal", onClick: () => {} },
    });
  };

  const handleLogout = () => {
    toast.warning("Yakin logout?", {
      action: {
        label: "Logout",
        onClick: () => {
          cookies.remove("login_token");
          cookies.remove("access_token");
          router.replace("/auth/login");
        },
      },
    });
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />
      <Toaster richColors />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

          {/* ===== HEADER ===== */}
          <div className="rounded-3xl p-6 bg-white border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <UserIcon />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                Basic Account
              </span>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() =>
                  window.open("https://khlasify.myr.id/pl/content-pro/")
                }
                className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
              >
                <Crown className="w-4 h-4" />
                Upgrade to PRO
              </button>

              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>

          {/* ===== WIDGETS ===== */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Widgets</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget, index) => {
                const paused = isWidgetPaused(index);

                return (
                  <div
                    key={widget.id}
                    className={`rounded-2xl border bg-white transition ${
                      paused ? "opacity-70" : "hover:shadow-md"
                    }`}
                  >
                    {/* HEADER */}
                    <div className="flex justify-between p-5">
                      <div>
                        <p className="font-medium">
                          Widget #{widget.id.slice(0, 6).toUpperCase()}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                            paused
                              ? "bg-orange-50 text-orange-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          ● {paused ? "Paused" : "Active"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteWidget(widget.id)}
                        className="p-2 rounded-lg hover:bg-red-50"
                      >
                        <Trash2Icon className="w-5 h-5 text-slate-400 hover:text-red-500" />
                      </button>
                    </div>

                    {/* EMBED */}
                    <div className="px-5 pb-4">
                      <div
                        className={`flex gap-2 bg-purple-50 border rounded-xl px-3 py-2 ${
                          paused ? disabledClass : ""
                        }`}
                      >
                        <p className="text-xs font-mono truncate flex-1">
                          {widget.link}
                        </p>
                        <button
                          disabled={paused}
                          onClick={() => {
                            navigator.clipboard.writeText(widget.link);
                            toast.success("Link copied");
                          }}
                          className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg"
                        >
                          Copy
                        </button>
                      </div>

                      {!paused && (
                        <a
                          href={widget.link}
                          target="_blank"
                          className="inline-flex gap-1 text-xs text-purple-600 mt-2"
                        >
                          Open in new tab
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* ADVANCED */}
                    <button
                      disabled={paused}
                      onClick={() => toggleDetails(widget.id)}
                      className={`w-full px-5 py-3 text-xs border-t flex justify-between ${
                        paused ? disabledClass : "hover:bg-slate-50"
                      }`}
                    >
                      Show Advanced Details
                      {openDetails[widget.id] ? "▲" : "▼"}
                    </button>

                    {openDetails[widget.id] && !paused && (
                      <div className="px-5 pb-5 space-y-3 text-xs">
                        <div>
                          <p className="text-slate-500 mb-1">Token</p>
                          <div className="flex gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                            <span className="font-mono truncate flex-1">
                              {showTokens[widget.id]
                                ? widget.token
                                : "••••••••••••"}
                            </span>
                            <button
                              onClick={() =>
                                toggleTokenVisibility(widget.id)
                              }
                            >
                              {showTokens[widget.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-500 mb-1">Database ID</p>
                          <div className="bg-slate-50 px-3 py-2 rounded-lg font-mono truncate">
                            {widget.dbID}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
