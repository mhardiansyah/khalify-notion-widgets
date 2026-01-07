"use client";

import { useEffect, useState } from "react";
import { Folder, Loader2 } from "lucide-react";
import { getNotionDatabases } from "@/app/lib/widget.api";

interface SelectDatabaseStepProps {
  token: string;
  onSelect: (dbId: string, name: string) => Promise<void> | void;
}

export default function SelectDatabaseStep({
  token,
  onSelect,
}: SelectDatabaseStepProps) {
  const [databases, setDatabases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingDbId, setProcessingDbId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDb = async () => {
      setLoading(true);
      const res = await getNotionDatabases(token);
      setDatabases(res.data || []);
      setLoading(false);
    };
    fetchDb();
  }, [token]);

  const handleSelect = async (db: any) => {
    setProcessingDbId(db.id);
    await onSelect(db.id, db.name);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Database</h2>

      {databases.map((db) => {
        const isProcessing = processingDbId === db.id;

        return (
          <button
            key={db.id}
            disabled={!!processingDbId}
            onClick={() => handleSelect(db)}
            className={`w-full p-4 border rounded-lg text-left transition
              ${
                isProcessing
                  ? "border-purple-600 bg-purple-50"
                  : "hover:border-purple-500"
              }
              disabled:opacity-60`}
          >
            <div className="flex gap-3 items-center">
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              ) : (
                <Folder className="w-5 h-5 text-yellow-500" />
              )}

              <div className="flex-1">
                <p className="font-medium">
                  {db.name}
                  {isProcessing && (
                    <span className="ml-2 text-sm text-purple-600">
                      Processing…
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{db.id}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
