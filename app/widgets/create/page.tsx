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
import SelectDatabaseStep from "@/app/components/SelectDatabaseStep";

// STEP COMPONENTS

type WizardStep = 1 | 2 | 3 | 4 ;

export default function CreateWidgetPageMerged() {
  const [step, setStep] = useState<WizardStep>(1);

  const [notionToken, setNotionToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [db, setDb] = useState<string | null>(null);
  const [dbName, setDbName] = useState<string | null>(null);

  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const jwt = cookies.get("login_token");
    if (!jwt) {
      router.replace("/auth/login");
      return;
    }
    setUser({ jwt });
  }, [router]);

  const handleGenerateWidget = async () => {
    if (!db || !isTokenValid || !notionToken || !user?.jwt) return;

    setLoading(true);
    try {
      const res = await createWidget({
        token: notionToken,
        dbID: db,
        email: user.jwt,
        name: dbName || "My Notion Widget",
      });

      const embedLink = res?.data?.embedLink;
      if (!embedLink) return;

      setEmbedUrl(embedLink);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white p-10">
        {/* STEP INDICATOR */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-8">
            {[
              "Setup",
              "Create Token",
              "Input Token & Select DB",
              "Finish",
            ].map((label, i) => {
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
                    className={
                      step === id ? "text-purple-600" : "text-gray-500"
                    }
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-xl shadow">
          {step === 1 && <TemplateStep onConfirm={() => setStep(2)} />}

          {step === 2 && <CreateTokenStep onNext={() => setStep(3)} />}

          {step === 3 && (
            <InputTokenStep
              token={notionToken}
              setToken={setNotionToken}
              onDbSelect={(id, name) => {
                setDb(id);
                setDbName(name);
                handleGenerateWidget();
              }}
            />
          )}

          

          {step === 4 && (
            <FinishStep
              db={db!}
              embedUrl={embedUrl}
              token={notionToken}
              onBack={() => setStep(4)}
            />
          )}
        </div>
      </div>
    </>
  );
}
