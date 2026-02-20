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
  ExternalLink,
  Crown,
  User as UserIcon,
  Trash2Icon,
  X,
  Save,
  Link as LinkIcon,
  AlignLeft,
  Image as ImageIcon,
  AtSign,
  Loader2
} from "lucide-react";

import { deleteWidget, getWidgetsByUser, updateWidgetBranding } from "../lib/widget.api";
import { getPaymentLink, checkPaymentStatus } from "../lib/payment.api";
import { toast, Toaster } from "sonner";

// Update Interface biar support data branding dari Backend
interface Widget {
  id: string;
  token: string;
  dbID: string;
  create_at: string;
  profileId: string;
  name: string;
  link: string;
  // Field Custom Branding
  customName?: string;
  customUsername?: string;
  customBio?: string;
  customAvatar?: string;
  customLink?: string;
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
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [isPro, setIsPro] = useState(false);

  // --- STATE UNTUK MODAL EDIT ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    customName: "",
    customUsername: "",
    customBio: "",
    customAvatar: "",
    customLink: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const FREE_WIDGET_LIMIT = 1;
  const isWidgetPaused = (index: number) => !isPro && index >= FREE_WIDGET_LIMIT;
  const disabledClass = "opacity-50 pointer-events-none select-none";

  // 1. Inisialisasi Auth & Status PRO
  useEffect(() => {
    const token = cookies.get("login_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<any>(token);
      const userEmail = decoded.email;
      setUser({ email: userEmail, name: decoded.name });

      const performStatusCheck = async () => {
        if (!userEmail) return;
        try {
          const res = await checkPaymentStatus(userEmail);
          if (res.data && res.data.isPro) {
            setIsPro(true);
          }
        } catch (err) {
          console.error("Gagal cek status:", err);
        }
      };
      performStatusCheck();
    } catch (e) {
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
        const res = await getWidgetsByUser(jwt);
        if (res?.success) {
          setWidgets(res.data);
        }
      } catch (e) {
        console.error("🚨 LOAD WIDGET ERROR:", e);
      }
    };
    loadWidgets();
  }, []);

  // --- LOGIC EDIT MODAL ---
  const openEditModal = (widget: Widget) => {
    if (!isPro) {
      toast.error("Fitur Custom Branding hanya untuk akun PRO!");
      return;
    }
    setEditingWidgetId(widget.id);
    setEditFormData({
      customName: widget.customName || "",
      customUsername: widget.customUsername || "",
      customBio: widget.customBio || "",
      customAvatar: widget.customAvatar || "",
      customLink: widget.customLink || ""
    });
    setIsEditModalOpen(true);
  };

  const handleSaveBranding = async () => {
    if (!editingWidgetId) return;
    setIsSaving(true);

    try {
      const res = await updateWidgetBranding(editingWidgetId, editFormData);
      
      if (res?.success) {
        toast.success("Widget branding berhasil diupdate!");
        
        // Update state lokal biar gak perlu refresh
        setWidgets(prev => prev.map(w => 
          w.id === editingWidgetId 
            ? { ...w, ...editFormData } 
            : w
        ));
        setIsEditModalOpen(false);
      } else {
        toast.error("Gagal update widget");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  // --- EXISTING LOGIC ---
  const handleUpgrade = async () => {
    try {
      toast.loading("Membuka halaman pembayaran...");
      const res = await getPaymentLink();
      toast.dismiss();
      if (res?.paymentLink) {
        window.location.href = res.paymentLink;
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Gagal membuka pembayaran.");
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

      {/* --- MODAL EDIT POPUP --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-purple-600" />
                Customize Widget Bio
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    placeholder="e.g. Naufal Dev"
                    value={editFormData.customName}
                    onChange={(e) => setEditFormData({ ...editFormData, customName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <AtSign className="w-3 h-3" /> Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    placeholder="@naufal"
                    value={editFormData.customUsername}
                    onChange={(e) => setEditFormData({ ...editFormData, customUsername: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Avatar URL
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  placeholder="https://imgur.com/..."
                  value={editFormData.customAvatar}
                  onChange={(e) => setEditFormData({ ...editFormData, customAvatar: e.target.value })}
                />
                <p className="text-[10px] text-gray-400">Paste direct image link (jpg/png)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                  <AlignLeft className="w-3 h-3" /> Bio / Description
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition resize-none h-24"
                  placeholder="Tell something about your notion page..."
                  value={editFormData.customBio}
                  onChange={(e) => setEditFormData({ ...editFormData, customBio: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> External Link
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  placeholder="https://mysite.com"
                  value={editFormData.customLink}
                  onChange={(e) => setEditFormData({ ...editFormData, customLink: e.target.value })}
                />
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBranding}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-md shadow-purple-200 flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ... (KODE USER PROFILE & LICENSE BOX TETAP SAMA) ... */}
            <div className="md:col-span-2 rounded-3xl p-6 bg-white/70 backdrop-blur border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <UserIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <p className="font-medium text-slate-900">{user?.email}</p>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold ${isPro ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}
                >
                  {isPro ? "Pro" : "Starter"}
                </span>
              </div>

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

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:underline"
                >
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
              <h2 className="text-2xl font-semibold text-slate-900">
                Your Widgets
              </h2>
              <span className="px-4 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                {widgets.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget, index) => {
                const paused = isWidgetPaused(index);
                return (
                  <div
                    key={widget.id}
                    className={`rounded-2xl border bg-white shadow-sm transition ${paused ? "opacity-70 grayscale-[0.5]" : "hover:shadow-md"}`}
                  >
                    <div className="flex items-start justify-between p-5 gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 break-all">
                          Widget #{widget.id.slice(0, 6).toUpperCase()}
                        </p>
                        {paused ? (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1">
                            ● Paused (Upgrade Pro)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                            ● Active
                          </span>
                        )}
                      </div>
                      
                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-1">
                        {/* TOMBOL EDIT (Hanya aktif jika tidak paused & PRO) */}
                        <button
                          onClick={() => openEditModal(widget)}
                          disabled={paused}
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition group"
                          title="Edit Bio"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleDeleteWidget(widget.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition group"
                          title="Delete"
                        >
                          <Trash2Icon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="px-5 pb-4">
                      <p className="text-xs text-slate-500 mb-1">Embed Link</p>
                      <div
                        className={`flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 ${paused ? disabledClass : ""}`}
                      >
                        <p className="text-xs font-mono truncate flex-1 text-slate-700">
                          {widget.link}
                        </p>
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
                        <a
                          href={widget.link}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-purple-600 mt-2"
                        >
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
                            <span className="font-mono flex-1 truncate">
                              {widget.id}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">
                            Integration Token
                          </p>
                          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                            <span className="font-mono flex-1 truncate">
                              {showTokens[widget.id]
                                ? widget.token
                                : "••••••••••••••••••"}
                            </span>
                            <button
                              onClick={() => toggleTokenVisibility(widget.id)}
                            >
                              {showTokens[widget.id] ? (
                                <EyeOff className="w-4 h-4 text-slate-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Database ID</p>
                          <div className="bg-slate-50 rounded-lg px-3 py-2 font-mono truncate">
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