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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT — Summary + Create */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
                <h2 className="text-xl font-bold mb-4">Review & Generate</h2>

                <div className="bg-gray-50 border p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-500">Database ID</p>
                  <p className="text-gray-900 break-all">{db}</p>
                </div>

                <button
                  onClick={handleGenerateWidget}
                  className="w-full mt-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                >
                  Create Widget
                </button>

                <button
                  onClick={() => setStep(2)}
                  className="mt-4 w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
              </div>

              {/* RIGHT — LIVE PREVIEW */}
              <LivePreviewBox token={token} db={db} />
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <FinishStep
              onPrev={() => setStep(3)}
              embedUrl={embedUrl!}
              showMultimedia={showMultimedia}
              showTitle={showTitle}
              gridColumns={gridColumns}
              dbUrl={db!}
            />
          )}
        </div>
      </div>
    </>
  );
}
