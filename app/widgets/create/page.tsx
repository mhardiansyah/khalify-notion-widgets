"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { ConnectStep } from "@/app/components/connect-step";
import FinishStep from "@/app/components/finish-step";

export default function CreateWidgetPageMerged() {
  const [step, setStep] = useState(1);

  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);

  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [notionUrl, setNotionUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);

  /** GENERATE WIDGET – sekarang dipanggil dari STEP 2 */
  const handleGenerateWidget = async () => {
    if (!db || !isUrlValid || !notionUrl) return;

    setLoading(true);
    setToken(notionUrl);

    try {
      const res = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: notionUrl, db }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.embedUrl) {
        setEmbedUrl(data.embedUrl);
        setStep(3); // pindah ke step 3 setelah widget berhasil dibuat
      } else {
        console.error("Failed to create widget:", data);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error creating widget:", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-white text-black p-10">
        {/* STEP HEADER */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-10">
            {[1, 2, 3].map((id) => (
              <div key={id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white 
                    ${step === id ? "bg-purple-600" : "bg-gray-300"}`}
                >
                  {id}
                </div>
                <span
                  className={`${
                    step === id ? "text-purple-600" : "text-gray-600"
                  }`}
                >
                  {["Setup", "Connect", "Finish"][id - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-xl shadow">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">
                Step 1 — Setup Template
              </h1>
              <button
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <ConnectStep
              notionUrl={notionUrl}
              setNotionUrl={(val) => {
                setNotionUrl(val);
                setIsUrlValid(val.startsWith("ntn_"));
              }}
              isUrlValid={isUrlValid}
              setIsUrlValid={setIsUrlValid}
              onSelectDb={(dbId) => setDb(dbId)}
              onCreateWidget={handleGenerateWidget}
              loading={loading}
            />
          )}

          {/* STEP 3 — FINISH / RESULT */}
          {step === 3 && db && (
            <FinishStep
              db={db}
              embedUrl={embedUrl}
              onBack={() => setStep(2)}
              token={token}
            />
          )}
        </div>
      </div>
    </>
  );
}
