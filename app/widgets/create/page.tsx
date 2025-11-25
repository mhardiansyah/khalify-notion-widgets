"use client";

import { useState } from "react";
import NotionConnectForm from "@/app/components/NotionConnectForm";

export default function CreateWidgetPage() {
  const [step, setStep] = useState(1);

  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);

  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const copyText = async (text: string, type: "url" | "html") => {
    await navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 1500);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 1500);
    }
  };

  const handleGenerateWidget = async () => {
    if (!token || !db) return;

    setLoading(true);

    const res = await fetch("/api/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, db }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setEmbedUrl(data.embedUrl);
      setStep(4); // langsung ke Step 4 = Preview
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black p-10">

      {/* ----------------------------- */}
      {/*            STEPPER            */}
      {/* ----------------------------- */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-10">

          {[
            { id: 1, label: "Setup Template" },
            { id: 2, label: "Connect Integration" },
            { id: 3, label: "Create Widget" },
            { id: 4, label: "Preview" },
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white 
                  ${step === s.id ? "bg-purple-600" : "bg-gray-300"}
                `}
              >
                {s.id}
              </div>
              <span
                className={`font-medium ${
                  step === s.id ? "text-purple-600" : "text-gray-600"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------- */}
      {/*          STEP CONTENT          */}
      {/* ----------------------------- */}
      <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-xl shadow">

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Step 1 — Setup Notion Template</h1>
            <p className="text-gray-600 mb-6">
              Buat database Notion lo dulu sebelum lanjut.
            </p>

            <button
              className="px-5 py-3 bg-purple-600 text-white rounded-lg"
              onClick={() => setStep(2)}
            >
              Next →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Step 2 — Connect Integration</h1>
            <p className="text-gray-600 mb-6">
              Masukkan Notion Token & Database ID lo.
            </p>

            <NotionConnectForm
              onReady={({ token, db }) => {
                setToken(token);
                setDb(db);
                setStep(3);
              }}
            />
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Step 3 — Create Widget</h1>

            <div className="text-gray-600 mb-6 space-y-1">
              <p><strong>Token:</strong> {token!.slice(0, 4)}••••••</p>
              <p><strong>Database ID:</strong> {db}</p>
            </div>

            <button
              onClick={handleGenerateWidget}
              className="px-5 py-3 bg-purple-600 text-white rounded-lg"
            >
              {loading ? "Generating..." : "Create Widget →"}
            </button>
          </div>
        )}

        {/* STEP 4 — PREVIEW */}
        {step === 4 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Your Widget is Ready 🎉</h1>

            {/* URL + copy */}
            <div className="p-4 bg-white rounded-lg shadow mb-6">
              <p className="text-sm text-gray-500 mb-2">Embed URL:</p>

              <div className="flex items-center justify-between">
                <span className="text-purple-600 break-all">{embedUrl}</span>

                <button
                  onClick={() => copyText(embedUrl!, "url")}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
                >
                  {copiedUrl ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* PREVIEW */}
            <iframe
              src={embedUrl!}
              className="w-full h-[500px] rounded-lg border"
            />
          </div>
        )}
      </div>
    </div>
  );
}
