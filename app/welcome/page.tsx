/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { CheckCircle2 } from "lucide-react";

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

      <div className="max-w-5xl mx-auto px-12 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <img
            src="/ImageWithFallback.png"
            className="rounded-xl w-full"
            alt="UI Preview"
          />

          <div>
            <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
              Free Tool
            </span>

            <h1 className="text-4xl text-gray-900 font-bold mt-5">
              Making Instagram feed planning easier by bringing your grid view to Notion
            </h1>

            <p className="text-gray-600 text-lg mt-4 leading-relaxed">
              Just a few steps and you’ll have a beautiful Instagram-style gallery that updates automatically.
            </p>

            {/* CTA atas tetap kode 1 */}
            <button
              onClick={() => router.push("/widgets/create")}
              className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition"
            >
              Get Started →
            </button>
          </div>
        </div>

        {/* 🌟 EASY SETUP SECTION dari kode 2 */}
        <div className="mb-12">
          <h2 className="text-2xl text-gray-900 mb-6">Easy setups (5 mins):</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Setup Notion Template", desc: "Create your database in Notion" },
              { step: "2", title: "Connect Integration", desc: "Link your Notion workspace" },
              { step: "3", title: "Embed Widget", desc: "Add to your Notion page" },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🌈 VIDEO + WHY USE THIS (kode 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* VIDEO CARD */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-semibold">Video Tutorials</h3>
            </div>

            <ul className="space-y-2">
              <li className="text-sm text-purple-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Setup Guide
              </li>
              <li className="text-sm text-purple-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Using Pro Features
              </li>
            </ul>
          </div>

          {/* WHY USE THIS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-gray-900 font-semibold mb-4">Why use this?</h3>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Plan your Instagram feed visually</span>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Sync automatically with Notion database</span>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>No coding required</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA BUTTON BAWAH – posisi benar di luar grid */}
        <div className="flex justify-center md:justify-end mt-6">
          <button
            onClick={() => router.push("/wideget/create")}
            className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors shadow-lg shadow-purple-200 hover:shadow-xl"
          >
            <span>Let&apos;s Started</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 12l-6.75 6.75M17.25 12l-6.75-6.75M17.25 12H3"
              />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
}
