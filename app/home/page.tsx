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

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm w-full aspect-video">
            <iframe
              src="https://khalify-notion-widgets.vercel.app/embed/998875?db=2ed1519e-69f0-801d-9d05-f41df80688e3"
              className="w-full h-full"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div>
            <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
              Multi-Platform Content Preview
            </span>

            <h1 className="text-4xl text-gray-900 font-bold mt-5">
              Turn Notion into your visual content system.
            </h1>

            <p className="text-gray-600 text-lg mt-4 leading-relaxed">
              Plan, preview, and organize everything in one clean workspace.
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
          <h2 className="text-2xl text-gray-900 mb-6">
            Get started in 5 minutes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

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
                <CheckCircle2 className="w-4 h-4" /> Starter Setup
              </li>
              <li className="text-sm text-purple-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> PRO Setup
              </li>
            </ul>
          </div>

          {/* WHY USE THIS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-gray-900 font-semibold mb-4">Why creators use Content OS?</h3>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Plan content visually across platforms</span>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Live previews synced with your Notion database</span>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Clean, focused workflow — no coding needed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center md:justify-end mt-6">
          <button
            onClick={() => router.push("/widgets/create")}
            className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors shadow-lg shadow-purple-200 hover:shadow-xl"
          >
            <span>Start Setup</span>
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
