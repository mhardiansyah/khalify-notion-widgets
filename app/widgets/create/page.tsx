"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateWidgetPage() {
  // STEP STATE
  const [step, setStep] = useState(1);

  // FORM VALUES
  const [token, setToken] = useState("");
  const [dbUrl, setDbUrl] = useState("");
  const [dbValid, setDbValid] = useState(false);

  // GENERATED
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // VALIDATE DB LINK
  const validateDbUrl = (url: string) => {
    const isValid = url.includes("notion.so") && url.length > 20;
    setDbValid(isValid);
  };

  // FETCH PREVIEW DATA
  const fetchPreview = async () => {
    setLoadingPreview(true);

    const res = await fetch("/api/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, db: dbUrl }),
    });

    const data = await res.json();
    setLoadingPreview(false);

    if (data.success) {
      setEmbedUrl(data.embedUrl);
      setPreviewData(data.preview || []);
    }
  };

  // GENERATE WIDGET
  const handleGenerateWidget = async () => {
    await fetchPreview();
    setStep(3);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-semibold text-gray-900">Widget Setup</h1>
        <p className="text-gray-600 mt-2">
          Connect your Notion database in 3 easy steps
        </p>

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-20 mt-10 mb-14">
          {[
            { id: 1, label: "Integration", sub: "Setup token" },
            { id: 2, label: "Connect", sub: "Link database" },
            { id: 3, label: "Complete", sub: "Create widget" },
          ].map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold
                ${
                  step >= s.id ? "bg-purple-600" : "bg-gray-300 text-gray-700"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= s.id ? "text-purple-600" : "text-gray-600"
                }`}
              >
                {s.label}
              </span>
              <span className="text-xs text-gray-500">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div>
            {/* STEP 1 — TOKEN */}
            {step === 1 && (
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Notion Integration Token
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Required for authentication
                </p>

                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your integration token"
                  className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900"
                />

                <button
                  className="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={() => setStep(2)}
                  disabled={!token}
                >
                  Next Step →
                </button>
              </div>
            )}

            {/* STEP 2 — CONNECT DATABASE */}
            {step === 2 && (
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Database URL
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Link to your Notion database
                </p>

                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => {
                    setDbUrl(e.target.value);
                    validateDbUrl(e.target.value);
                  }}
                  placeholder="notion.so/your-database-url"
                  className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900"
                />

                {!dbValid && dbUrl && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Invalid URL
                  </p>
                )}

                <button
                  className="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-40"
                  onClick={handleGenerateWidget}
                  disabled={!dbValid}
                >
                  Create Gallery Widget ✓
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 mt-4 flex items-center gap-1"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* STEP 3 — SUCCESS */}
            {step === 3 && (
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ready to Create Widget!
                </h2>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <p className="text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Integration token configured
                  </p>
                  <p className="text-green-700 text-sm flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Database connected
                  </p>
                  <p className="text-green-700 text-sm flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Database URL validated
                  </p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg text-green-400 text-sm font-mono">
                  {embedUrl}
                </div>

                <button
                  className="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-lg transition hover:bg-purple-700"
                  onClick={() => navigator.clipboard.writeText(embedUrl || "")}
                >
                  Copy Embed Code
                </button>

                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-gray-600 mt-4 flex items-center gap-1"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE — LIVE PREVIEW */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Live Preview</h3>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  step === 3
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step === 3 ? "Connected" : "Not Connected"}
              </span>
            </div>

            {/* NOT READY */}
            {step !== 3 && (
              <div className="text-center text-gray-500 text-sm mt-12">
                <img
                  src="/placeholder.svg"
                  className="mx-auto w-40"
                  alt="not ready"
                />
                <p className="mt-4">Selesaikan terlebih dahulu semua langkah-langkahnya</p>
              </div>
            )}

            {/* READY → SHOW GRID */}
            {step === 3 && (
              <div>
                {loadingPreview ? (
                  <p className="text-center text-gray-500">Loading preview...</p>
                ) : (
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                  >
                    {previewData.map((img: any, i: number) => (
                      <img
                        key={i}
                        src={img}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
