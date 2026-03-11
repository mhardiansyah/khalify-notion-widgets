"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Folder,
  Sparkles,
  Ban, // 🔥 Tambahkan icon Ban untuk database yang sudah dipakai
} from "lucide-react";
import { getNotionDatabases } from "@/app/lib/widget.api";

interface InputTokenStepProps {
  token: string;
  setToken: (val: string) => void;
  setTokenValid: (val: boolean) => void;
  loadingCreate: boolean;
  onDbSelect: (dbId: string, name: string) => void;
}

export default function InputTokenStep({
  token,
  setToken,
  setTokenValid,
  loadingCreate,
  onDbSelect,
}: InputTokenStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databases, setDatabases] = useState<any[]>([]);
  const [selectedDb, setSelectedDb] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!token.startsWith("ntn_")) {
      setTokenValid(false);
      setDatabases([]);
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
        setTokenValid(true);
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

  const handleCreateWidget = () => {
    if (!selectedDb || loadingCreate) return;
    onDbSelect(selectedDb.id, selectedDb.name);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paste Notion Token</h2>

      {/* INPUT TOKEN */}
      <div className="relative">
        <input
          value={token}
          onChange={(e) => setToken(e.target.value.trim())}
          placeholder="ntn_xxxxxxxxx"
          className="
      w-full
      px-4 py-3
      pr-12
      text-sm sm:text-base
      border rounded-lg
      focus:ring-2 focus:ring-purple-500
      outline-none
    "
        />

        {token && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
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

          {databases.map((db) => {
            const active = selectedDb?.id === db.id;
            // 🔥 Cek apakah database ini sudah dijadikan widget
            const isAlreadyWidget = db.isAlreadyWidget === true;
            
            // Tombol di-disable jika sedang loading ATAU jika database sudah jadi widget
            const isDisabled = loadingCreate || isAlreadyWidget;

            return (
              <button
                key={db.id}
                onClick={() => {
                    // Proteksi ekstra: Mencegah state update jika tombol di-klik (meskipun di-disable)
                    if (isDisabled) return;
                    setSelectedDb({ id: db.id, name: db.name });
                }}
                disabled={isDisabled}
                className={`relative w-full p-4 border rounded-lg text-left transition-all overflow-hidden
                  ${
                    active
                      ? "border-purple-600 bg-purple-50 scale-[1.01]"
                      : isAlreadyWidget
                        ? "bg-gray-100 border-gray-200" // Warna khusus untuk disabled
                        : "hover:border-purple-400"
                  }
                  ${isDisabled ? "cursor-not-allowed opacity-70" : ""}
                `}
              >
                <div className={`flex gap-3 items-start ${isAlreadyWidget ? "grayscale" : ""}`}>
                  <Folder className={`w-5 h-5 mt-0.5 ${isAlreadyWidget ? "text-gray-400" : "text-yellow-500"}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${isAlreadyWidget ? "text-gray-500 line-through" : ""}`}>
                        {db.name}
                    </p>
                    <p className="text-xs text-gray-500 break-all">{db.id}</p>
                  </div>
                  
                  {/* 🔥 Tambahkan label visual agar user tahu kenapa tidak bisa dipilih */}
                  {isAlreadyWidget && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md shrink-0 border border-red-100">
                          <Ban className="w-3 h-3" />
                          Already Used
                      </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* CREATE WIDGET BUTTON */}
      {selectedDb && (
        <button
          onClick={handleCreateWidget}
          disabled={loadingCreate}
          className="
    w-full
    flex items-center justify-center gap-2
    py-3
    rounded-xl
    bg-purple-600 text-white font-semibold
    hover:bg-purple-700
    transition
    disabled:opacity-60 disabled:cursor-not-allowed
    text-sm sm:text-base
  "
        >
          {loadingCreate ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating widget...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Create Widget
            </>
          )}
        </button>
      )}
    </div>
  );
}