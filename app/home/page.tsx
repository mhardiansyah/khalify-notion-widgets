/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import cookies from "js-cookie";

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = cookies.get("login_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    setUser({ token });
    cookies.remove("login_email");
  }, []);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* ===== TOP SECTION ===== */}
        <div className="grid grid-cols-12 gap-10 mb-16 items-start">
          {/* PREVIEW - KIRI */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-4 h-full">
              <div className="w-full h-[520px] rounded-2xl overflow-hidden border">
                <iframe
                  src="https://widget.khlasify.com/embed/873472?db=2ed1519e-69f0-801d-9d05-f41df80688e3"
                  className="w-full h-full"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Live Widget Preview</span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                  Auto-synced from Notion
                </span>
              </div>
            </div>
          </div>

          {/* INFO PANEL - KANAN */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white border rounded-3xl p-8 h-full">
              <span className="inline-block px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                Multi-Platform Content Preview
              </span>

              <h1 className="text-3xl font-bold text-gray-900 mt-5 leading-tight">
                Turn Notion into your visual content system.
              </h1>

              <p className="text-gray-600 text-base mt-4 leading-relaxed">
                Plan, preview, and organize everything in one clean workspace.
              </p>

              <button
                onClick={() => router.push("/widgets/create")}
                className="mt-6 w-full bg-purple-600 text-white px-6 py-3 rounded-xl shadow hover:bg-purple-700 transition"
              >
                Get Started →
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN CONTENT ===== */}
        <div className="grid grid-cols-12 gap-10">
          {/* KIRI KOSONG (BIAR MIRIP ACCOUNT PAGE) */}
          <div className="hidden lg:block lg:col-span-7" />

          {/* KANAN */}
          <div className="col-span-12 lg:col-span-5 space-y-10">
            {/* EASY SETUP */}
            <div>
              <h2 className="text-2xl text-gray-900 mb-6">
                Get started in 5 minutes
              </h2>

              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Duplicate Content OS",
                    desc: "Create your database in Notion.",
                  },
                  {
                    step: "2",
                    title: "Connect Your Database",
                    desc: "Link your database to widget.",
                  },
                  {
                    step: "3",
                    title: "Embed Preview Widget",
                    desc: "Add to your Notion page.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white border rounded-xl p-5 hover:border-purple-300 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-semibold">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VIDEO + WHY */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-gray-900 font-semibold mb-3">
                  Video Tutorials
                </h3>

                <ul className="space-y-2">
                  <li className="text-sm text-purple-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Starter Setup
                  </li>
                  <li className="text-sm text-purple-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> PRO Setup
                  </li>
                </ul>
              </div>

              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-gray-900 font-semibold mb-4">
                  Why creators use Content OS?
                </h3>

                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Plan content visually across platforms
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Live previews synced with Notion
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Clean workflow — no coding
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/widgets/create")}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition shadow-lg"
            >
              <span>Start Setup</span>
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
