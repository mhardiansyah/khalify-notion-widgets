/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Link2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Loader2
} from 'lucide-react';

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

  // VALIDATOR update
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
    if (!input) return null;
    if (input.startsWith("ntn_")) return input.trim();
    const parts = input.split("/");
    const last = parts.pop() || "";
    if (last.startsWith("ntn_")) return last.trim();
    const uuid = last.replace(/-/g, "");
    return uuid.length === 32 ? uuid : null;
  };

  // AUTO DETECT DATABASE METADATA
  const detectDb = async (id: string) => {
    try {
      setLoadingDetect(true);
      setDetectError(null);

      const res = await fetch("/api/notion-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          token: process.env.NEXT_PUBLIC_NOTION_TOKEN
        }),
      });

      const data = await res.json();
      setLoadingDetect(false);

      if (!data.success) {
        setDetectError(data.error || "Invalid Database");
        setDbInfo(null);
        return;
      }

      setDbInfo({
        title: data.title,
        icon: data.icon,
        properties: data.properties
      });

    } catch (err: any) {
      setDetectError("Failed to connect");
      setLoadingDetect(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setNotionUrl(val);

    const ok = validate(val);
    setIsUrlValid(ok);

    if (!ok) {
      setDbInfo(null);
      return;
    }

    const id = extractId(val);
    if (id) {
      detectDb(id); // AUTO CONNECT 💥
    }
  };

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Link2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl text-gray-900">Connect Database</h2>
          <p className="text-sm text-gray-600">Paste your Notion DB ID to auto-connect</p>
        </div>
      </div>

      {/* INPUT */}
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
              ${notionUrl === ''
                ? 'border-gray-300 focus:ring-purple-500'
                : isUrlValid
                ? 'border-green-500 focus:ring-green-500'
                : 'border-red-500 focus:ring-red-500'}`}
          />

          {notionUrl !== "" && (
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
          <p className="text-sm text-red-600 mt-2">
            {detectError}
          </p>
        )}
      </div>

      {/* AUTO-CONNECTED DB PREVIEW */}
      {dbInfo && (
        <div className="p-4 rounded-lg border bg-white shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            {dbInfo.icon && <span className="text-2xl">{dbInfo.icon}</span>}
            <h3 className="font-medium text-gray-900">{dbInfo.title}</h3>
          </div>

          <p className="text-xs text-gray-500">
            Properties: {dbInfo.properties.length}
          </p>
        </div>
      )}

      {/* NEXT BUTTON */}
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
