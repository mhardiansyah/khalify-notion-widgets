/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { Book, Video, Mail, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Helps() {
  const faqs = [
    {
      question: "How do I create a Notion integration?",
      answer:
        'Go to notion.so/my-integrations and click "New integration". Give it a name, select the workspace, and copy the Internal Integration Token.',
    },
    {
      question: "Can I use the same integration for multiple widgets?",
      answer:
        "Yes! You can reuse the same integration token for all your widgets. You only need to create one integration per workspace.",
    },
    {
      question: "How do I embed the widget in my website?",
      answer:
        "After creating your widget, you’ll receive an embed code. Simply copy and paste this code into your HTML where you want the widget to appear.",
    },
    {
      question: "What's the difference between Basic and Pro?",
      answer:
        "Pro accounts get advanced customization options, priority support, unlimited widgets, and access to premium templates.",
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div className="max-w-5xl mx-auto px-12 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Find answers and get assistance</p>
        </div>

        {/* GRID SUPPORT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Documentation */}
          <div className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-6 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg text-gray-900">Documentation</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Read guides and tutorials to get the most out of the widget.
            </p>
            <a
              href="https://khlasify.super.site/docs/content-widget"
              className="text-purple-600 hover:text-purple-700 text-sm inline-flex items-center gap-1 transition-colors"
            >
              <span>View Documentation</span>
              <span>→</span>
            </a>
          </div>

          {/* Video */}
          <div className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-6 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg text-gray-900">Video Tutorials</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Watch step-by-step video guides to set up your widget.
            </p>
            <a
              href="#"
              className="text-purple-600 hover:text-purple-700 text-sm inline-flex items-center gap-1 transition-colors"
            >
              <span>Watch Videos</span>
              <span>→</span>
            </a>
          </div>

          {/* Email */}
          <div className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-6 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg text-gray-900">Email Support</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get help from our team. We typically reply within 24 hours.
            </p>
            <a
              href="mailto:hello@khlasify.com"
              className="text-purple-600 hover:text-purple-700 text-sm inline-flex items-center gap-1 transition-colors"
            >
              <span>hello@khlasify.com</span>
              <span>→</span>
            </a>
          </div>

          {/* Community */}
          <div className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-6 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900">Community</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Join the community & connect with other users.
            </p>
            <a
              href="https://t.me/khlasify_community"
              className="text-purple-600 hover:text-purple-700 text-sm inline-flex items-center gap-1 transition-colors"
            >
              <span>Join Community</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* FAQ — NEW UI */}
        <div>
          <h2 className="text-2xl text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const [open, setOpen] = useState(false);

              return (
                <div
                  key={index}
                  className="w-full border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
                >
                  {/* QUESTION */}
                  <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-semibold flex items-center justify-center">
                        Q
                      </div>
                      <span className="text-gray-900 font-medium text-lg">
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`text-purple-600 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* ANSWER */}
                  {open && (
                    <div className="mt-4 flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 font-semibold flex items-center justify-center">
                        A
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA CONTACT */}
        <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8 text-center">
          <h3 className="text-xl text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">Our team is ready to assist you</p>
          <button
            onClick={() => window.open("https://khlasify.super.site/support", "_blank")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors shadow-lg shadow-purple-200">
            Contact Support
          </button>
        </div>
      </div>
    </>
  );
}
