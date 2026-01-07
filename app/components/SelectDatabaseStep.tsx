"use client";

import { useEffect, useState } from "react";
import { Folder, Loader2 } from "lucide-react";
import { getNotionDatabases } from "@/app/lib/widget.api";

interface SelectDatabaseStepProps {
  token: string;
  onSelect: (dbId: string, name: string) => void;
}

export default function SelectDatabaseStep({
  token,
  onSelect,
}: SelectDatabaseStepProps) {
  const [databases, setDatabases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDb = async () => {
      const res = await getNotionDatabases(token);
      setDatabases(res.data || []);
      setLoading(false);
    };
    fetchDb();
  }, [token]);

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

      {databases.map((db) => (
        <button
          key={db.id}
          onClick={() => onSelect(db.id, db.name)}
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
  );
}
