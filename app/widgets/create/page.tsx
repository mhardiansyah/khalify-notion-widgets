"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { ConnectStep } from "@/app/components/connect-step";
import { CustomizeStep } from "@/app/components/customize-step";
import { FinishStep } from "@/app/components/finish-step";


export default function CreateWidgetPageMerged() {
  const [step, setStep] = useState(1);

  // --- LOGIC DARI KODE 1 ---
  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- UI STATE DARI KODE 2 ---
  const [notionUrl, setNotionUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);

  const [showMultimedia, setShowMultimedia] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [gridColumns, setGridColumns] = useState(3);

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
      setStep(4);
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-white text-black p-10">
        {/* HEADER STEP INDICATOR */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-10">
            {[
              { id: 1, label: "Setup Template" },
              { id: 2, label: "Connect" },
              { id: 3, label: "Customize" },
              { id: 4, label: "Finish" },
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

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-xl shadow">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Step 1 — Setup Notion Template</h1>
              <p className="text-gray-600 mb-6">Buat database Notion lo dulu sebelum lanjut.</p>

              <button
                className="px-5 py-3 bg-purple-600 text-white rounded-lg"
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 (UI dari KODE 2) */}
          {step === 2 && (
            <ConnectStep
              notionUrl={notionUrl}
              setNotionUrl={setNotionUrl}
              isUrlValid={isUrlValid}
              setIsUrlValid={setIsUrlValid}
              onNext={() => {
                // convert URL → token + db
                const dbIdExtracted = notionUrl.split("-").pop()?.replace("/", "");
                setDb(dbIdExtracted || null);

                // nanti token tetap user input atau auto
                setToken(process.env.NEXT_PUBLIC_NOTION_TOKEN || null);

                setStep(3);
              }}
            />
          )}

          {/* STEP 3 (UI dari KODE 2) */}
          {step === 3 && (
            <CustomizeStep
              showMultimedia={showMultimedia}
              setShowMultimedia={setShowMultimedia}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              gridColumns={gridColumns}
              setGridColumns={setGridColumns}
              onPrev={() => setStep(2)}
              onNext={handleGenerateWidget}
            />
          )}

          {/* STEP 4 (Gabung UI + Preview) */}
          {step === 4 && (
            <div className="space-y-8">
              <FinishStep
                onPrev={() => setStep(3)}
                embedUrl={embedUrl!}     // DITAMBAHKAN (custom)
              />

              {/* LIVE PREVIEW */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Live Preview</h3>
                <iframe
                  src={embedUrl!}
                  className="w-full h-[500px] rounded-lg border"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
