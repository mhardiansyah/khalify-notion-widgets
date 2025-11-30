"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { ConnectStep } from "@/app/components/connect-step";
import { CustomizeStep } from "@/app/components/customize-step";
import { FinishStep } from "@/app/components/finish-step";
import LivePreviewBox from "@/app/components/LivePreviewBox";

export default function CreateWidgetPageMerged() {
  const [step, setStep] = useState(1);

  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [notionUrl, setNotionUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);

  const [showMultimedia, setShowMultimedia] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [gridColumns, setGridColumns] = useState(3);

  /** GENERATE WIDGET */
  const handleGenerateWidget = async () => {
    if (!token || !db) {
      console.log("TOKEN/DB MISSING:", token, db);
      return;
    }

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
        {/* Step Header */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-10">
            {[1, 2, 3, 4].map((id) => (
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
                  {["Setup", "Connect", "Customize", "Finish"][id - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-xl shadow">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold mb-4">
                Step 1 — Setup Template
              </h1>
              <button
                className="px-5 py-3 bg-purple-600 text-white rounded-lg"
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
              onSelectDb={(dbId) => setDb(dbId)} // <-- SAVE DB ID
              onNext={() => {
                setToken(notionUrl); // <-- SAVE USER TOKEN
                setStep(3);
              }}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-8">
              {/* LEFT — Live Preview */}
              <LivePreviewBox token={token} db={db} step={step} />

              {/* RIGHT — Customize */}
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
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <FinishStep onPrev={() => setStep(3)} embedUrl={embedUrl!} />
          )}
        </div>
      </div>
    </>
  );
}
