/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Link2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface ConnectStepProps {
  notionUrl: string;
  setNotionUrl: (url: string) => void;
  isUrlValid: boolean;
  setIsUrlValid: (valid: boolean) => void;
  onNext: () => void;
}

export function ConnectStep({
  notionUrl,
  setNotionUrl,
  isUrlValid,
  setIsUrlValid,
  onNext,
}: ConnectStepProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const [loadingDetect, setLoadingDetect] = useState(false);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [detectError, setDetectError] = useState<string | null>(null);

  // VALIDATOR — accept ntn_, UUID, URL
  const validate = (input: string) => {
    if (!input) return false;
    if (input.startsWith("ntn_") && input.length > 20) return true;
    const clean = input.replace(/-/g, "");
    if (clean.length === 32) return true;
    if (input.includes("notion.so") || input.includes("ntn.so")) return true;
    return false;
  };

  // Extract ID
  const extractId = (input: string): string | null => {
    if (input.startsWith("ntn_")) return input.trim();
    const part = input.split("/").pop() || "";
    if (part.startsWith("ntn_")) return part.trim();
    const clean = part.replace(/-/g, "");
    return clean.length === 32 ? clean : null;
  };

  // AUTO DETECT DATABASE METADATA (PUBLIC API)
  const detectDb = async (id: string) => {
    setLoadingDetect(true);
    setDbInfo(null);
    setDetectError(null);

    const res = await fetch("/api/notion-detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    setLoadingDetect(false);

    if (!data.success) {
      setDetectError(data.error);
      return;
    }

    setDbInfo({
      title: data.title,
      icon: data.icon,
      propertiesCount: data.propertiesCount,
      publicUrl: data.publicUrl, 
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    setNotionUrl(raw);

    const ok = validate(raw);
    setIsUrlValid(ok);

    if (!ok) {
      setDbInfo(null);
      setDetectError(null);
      return;
    }

    const id = extractId(raw);
    if (id) detectDb(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Link2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl text-gray-900">Connect Database</h2>
          <p className="text-sm text-gray-600">
            Paste your Notion DB ID — auto-detect will run instantly
          </p>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Notion Database ID
        </label>
        <div className="relative">
          <input
            type="text"
            value={notionUrl}
            onChange={handleUrlChange}
            placeholder="ntn_xxxxxxxxxxxxxxxxxxxxx"
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900
              placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all
              ${
                notionUrl === ""
                  ? "border-gray-300 focus:ring-purple-500"
                  : isUrlValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
          />

          {/* Status Icon */}
          {notionUrl && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {loadingDetect ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              ) : isUrlValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>

        {detectError && (
          <p className="text-sm text-red-600 mt-2">{detectError}</p>
        )}
      </div>

      {/* Connected Database Preview */}
      {dbInfo && (
        <div className="p-4 rounded-lg border bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            {dbInfo.icon && <span className="text-2xl">{dbInfo.icon}</span>}
            <h3 className="font-medium text-gray-900 text-lg">
              {dbInfo.title}
            </h3>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Properties:</strong> {dbInfo.propertiesCount}
            </p>

            {/* 👇 Tambahin ini */}
            <p>
              <strong>Database URL:</strong>
              <br />
              <a
                href={dbInfo.publicUrl}
                className="text-blue-600 underline"
                target="_blank"
              >
                {dbInfo.publicUrl}
              </a>
            </p>

            <p className="text-green-600 font-medium">
              Connected via Public Notion API
            </p>
          </div>
        </div>
      )}

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!dbInfo}
        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 
          text-white rounded-lg transition-colors disabled:opacity-50
          disabled:cursor-not-allowed"
      >
        Continue to Customize
      </button>
    </div>
  );
}
