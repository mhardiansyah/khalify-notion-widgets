"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import FinishStep from "@/app/components/finish-step";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
import { createWidget } from "@/app/lib/widget.api";
import CreateTokenStep from "@/app/components/CreateTokenStep";
import InputTokenStep from "@/app/components/InputTokenStep";
import TemplateStep from "@/app/components/TemplateStep";

type WizardStep = 1 | 2 | 3;

export default function CreateWidgetPageMerged() {
  const [step, setStep] = useState<WizardStep>(1);

  const [notionToken, setNotionToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [db, setDb] = useState<string | null>(null);
  const [dbName, setDbName] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ jwt: string } | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const router = useRouter();

  // 🔐 soft guard → popup instead of redirect
  useEffect(() => {
    const jwt = cookies.get("login_token");
    if (!jwt) {
      setShowLoginAlert(true);
      return;
    }
    setUser({ jwt });
  }, []);

  const handleGenerateWidget = async (dbId: string, name: string) => {
    if (!user || !isTokenValid || !notionToken) return;

    setLoading(true);
    try {
      const res = await createWidget({
        token: notionToken,
        dbID: dbId,
        email: user.jwt,
        name,
      });

      const embedLink = res?.data?.embedLink;
      if (!embedLink) return;

      setDb(dbId);
      setDbName(name);
      setEmbedUrl(embedLink);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* 🔔 LOGIN POPUP */}
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold">Login required 🔐</h2>
            <p className="text-gray-600">
              Please login first to create your widget.
            </p>

            <div className="flex justify-center gap-3">           
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Back
              </button>

              <button
                onClick={() => router.push("/auth/login")}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 LOCKED CONTENT */}
      {!user ? (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Waiting for login...
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-8 md:py-12">
            {/* STEP INDICATOR */}
            <div className="flex justify-center mb-10">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                {["Start", "Setup", "Finish"].map((label, i) => {
                  const id = (i + 1) as WizardStep;
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                        ${step === id ? "bg-purple-600" : "bg-gray-300"}`}
                      >
                        {id}
                      </div>
                      <span
                        className={`text-sm sm:text-base ${
                          step === id ? "text-purple-600" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CONTENT */}
            <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-xl shadow">

              {step === 1 && <TemplateStep onConfirm={() => setStep(2)} />}

              {step === 2 && (
                <>
                  {!showTokenInput ? (
                    <CreateTokenStep onNext={() => setShowTokenInput(true)} />
                  ) : (
                    <InputTokenStep
                      token={notionToken}
                      setToken={setNotionToken}
                      setTokenValid={setIsTokenValid}
                      loadingCreate={loading}
                      onDbSelect={(id, name) => handleGenerateWidget(id, name)}
                    />
                  )}
                </>
              )}

              {step === 3 && (
                <FinishStep
                  db={db!}
                  embedUrl={embedUrl}
                  token={notionToken}
                  onBack={() => setStep(3)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
