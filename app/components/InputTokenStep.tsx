"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Folder,
} from "lucide-react";
import { getNotionDatabases } from "@/app/lib/widget.api";

interface InputTokenStepProps {
  token: string;
  setToken: (val: string) => void;
  setTokenValid: (val: boolean) => void; // ✅ NEW
  onDbSelect: (dbId: string, name: string) => void;
}


export default function InputTokenStep({
  token,
  setToken,
  setTokenValid,
  onDbSelect,
}: InputTokenStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databases, setDatabases] = useState<any[]>([]);

  useEffect(() => {
  if (!token.startsWith("ntn_")) {
    setTokenValid(false);
    return;
  }

  const validateAndFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getNotionDatabases(token);

      if (!res.data || res.data.length === 0) {
        setError("Token valid tapi database tidak ditemukan");
        setDatabases([]);
        setTokenValid(false);
        return;
      }

      setDatabases(res.data);
      setTokenValid(true); // 🔥 PENTING
    } catch {
      setError("Invalid token atau belum di-share ke database");
      setDatabases([]);
      setTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  validateAndFetch();
}, [token, setTokenValid]);


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paste Notion Token</h2>

      {/* INPUT TOKEN */}
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
            ) : databases.length > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* DATABASE LIST */}
      {databases.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Select Database</h3>

          {databases.map((db) => (
            <button
              key={db.id}
              onClick={() => onDbSelect(db.id, db.name)}
              className="w-full p-4 border rounded-lg text-left hover:border-purple-500"
            >
              <div className="flex gap-3">
                <Folder className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">{db.name}</p>
                  <p className="text-xs text-gray-500">{db.id}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
