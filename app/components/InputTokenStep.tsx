"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getNotionDatabases } from "@/app/lib/widget.api";

interface InputTokenStepProps {
  token: string;
  setToken: (val: string) => void;
  onValid: () => void;
}

export default function InputTokenStep({
  token,
  setToken,
  onValid,
}: InputTokenStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = async (value: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getNotionDatabases(value);
      if (!res.data || res.data.length === 0) {
        setError("No database found or token invalid");
        return;
      }
      onValid();
    } catch {
      setError("Invalid token or no access");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Paste Notion Token</h2>

      <div className="relative">
        <input
          value={token}
          onChange={(e) => setToken(e.target.value.trim())}
          placeholder="ntn_xxxxxxxxx"
          className="w-full px-4 py-3 border rounded-lg"
        />

        {token && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            ) : error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={() => validate(token)}
        disabled={!token || loading}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
      >
        Validate Token
      </button>
    </div>
  );
}
