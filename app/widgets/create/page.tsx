"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { ConnectStep } from "@/app/components/connect-step";
import FinishStep from "@/app/components/finish-step";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
import { createWidget } from "@/app/lib/widget.api";

export default function CreateWidgetPageMerged() {
  const [step, setStep] = useState(1);

  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);

  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [notionUrl, setNotionUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();


  useEffect(() => {
  const jwt = cookies.get("login_token");

  if (!jwt) {
    router.replace("/auth/login");
    return;
  }

  // simpan JWT MENTAH
  setUser({ jwt });
}, [router]);


  const handleGenerateWidget = async () => {
  if (!db || !isUrlValid || !notionUrl || !user?.jwt) return;

  setLoading(true);

  try {
    const res = await createWidget({
      token: notionUrl,
      dbID: db,
      email: user.jwt, 
    });

    console.log("res: ", res);
    const embedLink = res?.data?.embedLink;


    if (!embedLink) {
      console.log("Embed link Not found", res);
      return;
    }

    setEmbedUrl(embedLink);

    setStep(3);
  } catch (err) {
    console.error("Error creating widget:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-white text-black p-10">
        {/* Step Indicator */}
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

        {/* Step Content */}
        <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-xl shadow">
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
