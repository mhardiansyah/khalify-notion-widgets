/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ConnectStepProps {
  notionUrl: string;
  setNotionUrl: (url: string) => void;
  isUrlValid: boolean;
  setIsUrlValid: (valid: boolean) => void;
  onSelectDb: (dbId: string) => void;
  onCreateWidget: () => void;
  loading: boolean;
}

export function ConnectStep({
  notionUrl,
  setNotionUrl,
  isUrlValid,
  setIsUrlValid,
  onSelectDb,
  onCreateWidget,
  loading,
}: ConnectStepProps) {
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [databases, setDatabases] = useState<any[]>([]);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [selectedDb, setSelectedDb] = useState<any>(null);

  /** VALIDATOR → hanya token ntn_ */
  const validate = (input: string) => {
    return input.startsWith("ntn_") && input.length > 20;
  };

  /** FETCH DATABASE LIST FROM BACKEND */
  const detectDb = async (token: string) => {
    setLoadingDetect(true);
    setDetectError(null);
    setDatabases([]);
    setSelectedDb(null);

    try {
      const res = await fetch("/api/notion-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      setLoadingDetect(false);

      if (!data.databases || data.databases.length === 0) {
        setDetectError("No databases found or token invalid.");
        return;
      }

      setDatabases(data.databases);
    } catch (err) {
      setLoadingDetect(false);
      setDetectError("Failed to fetch databases.");
    }
  };

  /** INPUT HANDLER */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    setNotionUrl(raw);

    const ok = validate(raw);
    setIsUrlValid(ok);

    if (!ok) {
      setDatabases([]);
      setDetectError(null);
      return;
    }

    detectDb(raw);
  };

  const handleCreateWidgetClick = () => {
    if (!selectedDb || !isUrlValid || loading) return;
    onCreateWidget();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Link2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl">Connect to Notion</h2>
          <p className="text-sm text-gray-600">
            Paste your Notion Integration token
          </p>
        </div>
      </div>

      {/* TOKEN INPUT */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Notion Token</label>

        <div className="relative">
          <input
            type="text"
            value={notionUrl}
            onChange={handleUrlChange}
            placeholder="ntn_xxxxxxxxxxxxx"
            className={`w-full px-4 py-3 border rounded-lg`}
          />

          {/* STATUS ICON */}
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

      {/* DATABASE LIST */}
      {databases.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">Select Database</p>

          {databases.map((db) => (
            <div
              key={db.id}
              onClick={() => {
                setSelectedDb(db);
                onSelectDb(db.id);
              }}
              className={`p-4 border rounded-lg cursor-pointer transition
                ${
                  selectedDb?.id === db.id
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{db.icon?.emoji || "📁"}</span>
                <div>
                  <p className="font-medium">{db.name}</p>
                  <p className="text-xs text-gray-500">{db.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE WIDGET BUTTON (Step 2) */}
      <button
        onClick={handleCreateWidgetClick}
        disabled={!selectedDb || !isUrlValid || loading}
        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition"
      >
        {loading ? "Creating..." : "Create Widget"}
      </button>
    </div>
  );
}
