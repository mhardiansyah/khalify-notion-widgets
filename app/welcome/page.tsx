/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.replace("/login");
      setUser(data.user);
    };
    loadUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-10 min-h-screen">
        {/* TOP HERO SECTION (kode 1) */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="/ImageWithFallback.png"
            className="rounded-xl shadow-lg w-full"
            alt="UI Preview"
          />

          <div>
            <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
              Free Tool
            </span>

            <h1 className="text-3xl font-bold mt-4">
              Making Instagram feed planning easier by bringing your grid view
              to Notion
            </h1>

            <p className="text-gray-600 mt-3">
              Just a few steps and you’ll have a beautiful Instagram-style
              gallery that updates automatically.
            </p>

            {/* Get started tetap versi kode 1 */}
            <button
              onClick={() => router.push("/setup")}
              className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition"
            >
              Get Started →
            </button>
          </div>
        </div>

        {/* Easy Setup Section (UI seperti screenshot) */}
        <h2 className="text-xl font-semibold mt-20 mb-6">
          Easy setups (5 mins):
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Setup Notion Template",
              desc: "Create your database in Notion",
            },
            {
              step: "2",
              title: "Connect Integration",
              desc: "Link your Notion workspace",
            },
            {
              step: "3",
              title: "Embed Widget",
              desc: "Add to your Notion page",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-gray-200 p-8 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mb-5 text-lg font-semibold shadow">
                {item.step}
              </div>

              <h3 className="text-gray-900 font-semibold text-lg mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* VIDEO + WHY USE THIS (tetap kode 1) */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {/* VIDEO TUTORIALS */}
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
            <h3 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                🎬
              </span>
              Video Tutorials
            </h3>

            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Setup Guide
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Using Pro Features
              </li>
            </ul>
          </div>

          {/* WHY USE THIS */}
          <div className="p-6 bg-white rounded-xl border shadow-sm">
            <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
              Why use this?
            </h3>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span>
                Plan your Instagram feed visually
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span>
                Sync automatically with Notion database
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span>
                No coding required
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
