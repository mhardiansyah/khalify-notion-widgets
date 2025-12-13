/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "../components/Navbar";
import {
  Edit2,
  Eye,
  EyeOff,
  MoreVertical,
  ExternalLink,
  Crown,
  User as UserIcon,
} from "lucide-react";

/* =======================
   TYPES
======================= */
interface Widget {
  id: string;
  name: string;
  integrationToken: string;
  database: string;
  url: string;
}

export default function AccountsPage() {
  const router = useRouter();

  /* =======================
     AUTH / PROFILE STATE
  ======================= */
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     WIDGET STATE
  ======================= */
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<{ [key: string]: boolean }>({});

  /* =======================
     LOAD USER (Supabase)
  ======================= */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  /* =======================
     LOAD WIDGETS (STATIC, VIA useEffect)
     → nanti gampang ganti ke Supabase
  ======================= */
  useEffect(() => {
    const loadWidgets = async () => {
      setWidgets([
        {
          id: "O2EOKV",
          name: "Widget #O2EOKV",
          integrationToken: "••••••••••••••••••••••••••••••••",
          database: "2eebd26b4b98367d12771cec1",
          url: "https://www.graceandigrow.co/o2okV",
        },
        {
          id: "Ob2J3h",
          name: "iglayout",
          integrationToken: "••••••••••••••••••••••••••••••••",
          database: "2e43dd8799dd8ebb42cf6b5c8fb591",
          url: "https://www.graceandigrow.co/Ob2J3h",
        },
        {
          id: "er8u0T",
          name: "Widget #er8u0T",
          integrationToken: "••••••••••••••••••••••••••••••••",
          database: "2e0c026d94b91e5af7e89f7abd94de",
          url: "https://www.graceandigrow.co/er#u8T",
        },
      ]);
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
          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-6">
            {/* PERSONAL INFO */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-5">
                <div className="pb-4 border-b border-gray-100">
                  <label className="block text-xs text-gray-500 mb-2">
                    Email
                  </label>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">{user.email}</p>
                    <button className="text-sm text-purple-600 flex items-center gap-1">
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>

                <div className="pb-4 border-b border-gray-100">
                  <label className="block text-xs text-gray-500 mb-2">
                    Name
                  </label>
                  <p className="text-gray-500 text-sm">No name</p>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">
                      Basic Account
                    </span>
                    <button className="text-sm text-purple-600 flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm text-gray-600 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl text-purple-600">
                    {widgets.length}
                  </p>
                  <p className="text-xs text-gray-600">Active Widgets</p>
                </div>
                <div>
                  <p className="text-2xl text-purple-600">∞</p>
                  <p className="text-xs text-gray-600">API Calls</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Your Widgets</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                {widgets.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition"
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                        {widget.id.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-gray-900">{widget.name}</h3>
                        <p className="text-xs text-gray-500">
                          ID: {widget.id}
                        </p>
                      </div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </div>

                  {/* TOKEN */}
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <label className="block text-xs text-gray-500 mb-2">
                      Integration Token
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm truncate flex-1">
                        {showTokens[widget.id]
                          ? "ntn_38356847923abcdef..."
                          : widget.integrationToken}
                      </p>
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

                  {/* DATABASE */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-500">
                      Database
                    </label>
                    <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded truncate">
                      {widget.database}
                    </p>
                  </div>

                  {/* URL */}
                  <a
                    href={widget.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 flex items-center justify-between"
                  >
                    <span className="truncate">{widget.url}</span>
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
