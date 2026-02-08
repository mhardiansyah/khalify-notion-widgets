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
  Loader2, // Tambah icon loading
} from "lucide-react";

import { deleteWidget, getWidgetsByUser } from "../lib/widget.api";
// Pastikan fungsi ini sudah ada di lib lo (sesuai contoh sebelumnya)
import { getPaymentLink, checkPaymentStatus } from "../lib/payment.api"; 
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

  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false); // State untuk overlay polling

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});

  const [isPro, setIsPro] = useState(false); // State PRO sekarang dinamis
  const FREE_WIDGET_LIMIT = 1;

  const isWidgetPaused = (index: number) => !isPro && index >= FREE_WIDGET_LIMIT;
  const disabledClass = "opacity-50 pointer-events-none select-none";

  // 1. Inisialisasi Auth & Status PRO
  // 1. Inisialisasi Auth & Status PRO
  useEffect(() => {
    const token = cookies.get("login_token");
    console.log("🔍 Checking login_token:", token ? "Token Found" : "No Token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<any>(token);
      console.log("👤 Decoded User Data:", decoded);
      setUser({ email: decoded.email, name: decoded.name });
      
      const initStatus = async () => {
        console.log("📡 Initializing Payment Status Check...");
        const res = await checkPaymentStatus();
        console.log("💳 Payment Status Response:", res);
        
        if (res.isPro) {
          console.log("✅ User is PRO");
          setIsPro(true);
        } else {
          console.log("❌ User is STARTER");
        }
      };
      initStatus();

    } catch (e) {
      console.error("🚨 Auth Initialization Error:", e);
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 2. Load Widgets
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const jwt = cookies.get("login_token");
        if (!jwt) return;

        console.log("📦 Fetching Widgets...");
        const res = await getWidgetsByUser(jwt);
        console.log("📊 Widgets Loaded:", res.data);
        
        if (res?.success) {
          setWidgets(res.data);
        }
      } catch (e) {
        console.error("🚨 LOAD WIDGET ERROR:", e);
      }
    };

    loadWidgets();
  }, []);

  // 3. LOGIC UPGRADE & POLLING
  const handleUpgrade = async () => {
    try {
      console.log("🚀 Starting Upgrade Process...");
      setIsSyncing(true); 
      
      const res = await getPaymentLink();
      console.log("🔗 Mayar Link Generated:", res.paymentLink);
      window.open(res.paymentLink, "_blank");

      toast.info("Silahkan selesaikan pembayaran di tab baru...");

      console.log("⏲️ Polling Started: Checking Notion every 5 seconds...");
      const interval = setInterval(async () => {
        try {
          const check = await checkPaymentStatus();
          console.log("🔄 Polling Status:", check.status, "| isPro:", check.isPro);
          
          if (check.isPro) {
            console.log("🎉 Payment Verified! Switching to PRO mode.");
            clearInterval(interval);
            setIsPro(true);
            setIsSyncing(false);
            toast.success("Upgrade Berhasil! Akun Anda sudah PRO.");
          }
        } catch (err) {
          console.error("🚨 Polling API Error:", err);
        }
      }, 5000);

      // C. Safety Timeout
      setTimeout(() => {
        console.log("🛑 Polling Timeout: Stopped after 10 minutes.");
        clearInterval(interval);
        setIsSyncing(false);
      }, 600000);

    } catch (error) {
      console.error("🚨 Upgrade Error:", error);
      setIsSyncing(false);
      toast.error("Gagal memproses pembayaran, coba lagi nanti.");
    }
  };

  const toggleTokenVisibility = (id: string) => {
    setShowTokens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDetails = (id: string) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
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
              setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
              toast.success("Widget berhasil dihapus");
            }
          } catch (err) {
            toast.error("Gagal menghapus widget");
          }
        },
      },
    });
  };

  const handleLogout = () => {
    cookies.remove("access_token");
    cookies.remove("login_token");
    cookies.remove("login_email");
    router.replace("/auth/login");
  };

  const license = {
    key: "e90d011-2302-dc51-8805-f18409C33F",
    expiredAt: "Nov 2, 2025",
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />
      <Toaster position="top-center" richColors />

      {/* OVERLAY LOADING SAAT POLLING */}
      {isSyncing && (
        <div className="fixed inset-0 z-[999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Sinkronisasi Pembayaran...</h2>
          <p className="text-slate-500 mt-2 text-center px-6">
            Kami sedang mengecek status transaksi Anda di Notion. <br/>
            Halaman ini akan otomatis diperbarui.
          </p>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl p-6 bg-white/70 backdrop-blur border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <UserIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <p className="font-medium text-slate-900">{user?.email}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${isPro ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                  {isPro ? "Pro" : "Starter"}
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">🔑</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Your License</p>
                    <p className="text-xs text-slate-500">Basic License Key</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl px-4 py-3 border">
                  <p className="text-[11px] text-slate-500 mb-1 flex justify-between">
                    <span>Activated</span>
                    <span className="text-slate-400">{license.expiredAt}</span>
                  </p>
                  <p className="font-mono text-xs text-slate-800 truncate">{license.key}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* TOMBOL UPGRADE DINAMIS */}
                {!isPro ? (
                   <button
                   onClick={handleUpgrade}
                   className="flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition"
                 >
                   <Crown className="w-4 h-4" />
                   Upgrade to PRO
                 </button>
                ) : (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <Crown className="w-4 h-4" /> Anda sudah berlangganan PRO
                  </span>
                )}

                <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
                  Logout
                </button>
              </div>
            </div>

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

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Your Widgets</h2>
              <span className="px-4 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                {widgets.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget, index) => {
                const paused = isWidgetPaused(index);
                return (
                  <div key={widget.id} className={`rounded-2xl border bg-white shadow-sm transition ${paused ? "opacity-70 grayscale-[0.5]" : "hover:shadow-md"}`}>
                    <div className="flex items-start justify-between p-5 gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 break-all">
                          Widget #{widget.id.slice(0, 6).toUpperCase()}
                        </p>
                        {paused ? (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1">● Paused (Upgrade Pro)</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">● Active</span>
                        )}
                      </div>
                      <button onClick={() => handleDeleteWidget(widget.id)} className="p-2 rounded-lg hover:bg-red-50 transition group">
                        <Trash2Icon className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                      </button>
                    </div>

                    <div className="px-5 pb-4">
                      <p className="text-xs text-slate-500 mb-1">Embed Link</p>
                      <div className={`flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 ${paused ? disabledClass : ""}`}>
                        <p className="text-xs font-mono truncate flex-1 text-slate-700">{widget.link}</p>
                        <button
                          disabled={paused}
                          onClick={() => {
                            navigator.clipboard.writeText(widget.link);
                            toast.success("Link copied");
                          }}
                          className="flex items-center gap-1 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                          Copy
                        </button>
                      </div>
                      {!paused && (
                        <a href={widget.link} target="_blank" className="inline-flex items-center gap-1 text-xs text-purple-600 mt-2">
                          Open in new tab <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <button
                      disabled={paused}
                      onClick={() => toggleDetails(widget.id)}
                      className={`w-full flex items-center justify-between px-5 py-3 text-xs text-slate-500 border-t hover:bg-slate-50 transition ${!openDetails[widget.id] ? "rounded-b-2xl" : ""} ${paused ? disabledClass : ""}`}
                    >
                      Show Advanced Details {openDetails[widget.id] ? "▲" : "▼"}
                    </button>

                    {openDetails[widget.id] && !paused && (
                      <div className="px-5 pb-5 space-y-3 text-xs rounded-b-2xl">
                        <div>
                          <p className="text-slate-500 mb-1">Widget ID</p>
                          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                            <span className="font-mono flex-1 truncate">{widget.id}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Integration Token</p>
                          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                            <span className="font-mono flex-1 truncate">{showTokens[widget.id] ? widget.token : "••••••••••••••••••"}</span>
                            <button onClick={() => toggleTokenVisibility(widget.id)}>
                              {showTokens[widget.id] ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Database ID</p>
                          <div className="bg-slate-50 rounded-lg px-3 py-2 font-mono truncate">{widget.dbID}</div>
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