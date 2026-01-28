/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  ExternalLink,
  Folder,
} from "lucide-react";
import { getNotionDatabases } from "../lib/widget.api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { ScrollArea } from "./scroll-area";

interface ConnectStepProps {
  notionUrl: string;
  setNotionUrl: (url: string) => void;
  isUrlValid: boolean;
  setIsUrlValid: (valid: boolean) => void;
  onSelectDb: (dbId: string, name: string) => void;
  onCreateWidget: () => void;
  loading: boolean;
}

const requiredProperties = [
  { name: "Name", type: "Title" },
  { name: "Publish Date", type: "Date" },
  { name: "Attachment", type: "Files & Media" },
  { name: "Pin", type: "Checkbox" },
  { name: "Platform", type: "Select" },
  { name: "Status", type: "Select" },
  { name: "Pillar", type: "Select" },
];

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

  const validate = (token: string) =>
    token.startsWith("ntn_") && token.length > 20;

  const detectDb = async (token: string) => {
    setLoadingDetect(true);
    setDetectError(null);

    try {
      const res = await getNotionDatabases(token);
      if (!res.data || res.data.length === 0) {
        setDetectError("No databases found or token invalid.");
        return;
      }
      setDatabases(res.data);
    } catch {
      setDetectError("Failed to fetch databases.");
    } finally {
      setLoadingDetect(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setNotionUrl(value);

    const ok = validate(value);
    setIsUrlValid(ok);

    if (!ok) {
      setDatabases([]);
      setDetectError(null);
      return;
    }

    detectDb(value);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Link2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl text-gray-900">Connect to Notion</h2>
            <p className="text-sm text-gray-500">
              Paste your Notion Integration token
            </p>
          </div>
        </div>

        {/* DRAWER */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
              <HelpCircle className="w-4 h-4" />
              Need Help?
            </button>
          </SheetTrigger>

          <SheetContent className="sm:max-w-lg p-0">
            <SheetHeader className="space-y-3 px-6 pt-6 pb-6 border-b border-gray-200">
              <SheetTitle className="text-xl">How to Connect Notion</SheetTitle>
              <SheetDescription className="text-sm">
                Follow these steps to set up your Notion database integration
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-140px)]">
              <div className="px-6 py-6 space-y-10">
                {/* STEP 1 */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-base text-gray-900 mb-1">
                      Step 1: Choose Your Setup Method
                    </h3>
                    <p className="text-sm text-gray-500">
                      Select one option below to get started
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* OPTION 1 */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="px-2.5 py-0.5 bg-purple-600 text-white rounded text-xs">
                          Option 1
                        </div>
                        <h4 className="text-sm text-gray-900">
                          Use Our Template (Recommended)
                        </h4>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        Start easily by duplicating our ready-to-use template.
                      </p>

                      <a
                        href="https://notion.so/your-template-link"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg"
                      >
                        Get Notion Template
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* OPTION 2 */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="px-2.5 py-0.5 bg-purple-600 text-white rounded text-xs">
                          Option 2
                        </div>
                        <h4 className="text-sm text-gray-900">
                          Setup Database Manually
                        </h4>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="space-y-2.5">
                          {requiredProperties.map((prop) => (
                            <div
                              key={prop.name}
                              className="flex items-start gap-2"
                            >
                              <span className="text-purple-600 mt-0.5 text-sm">
                                •
                              </span>
                              <div className="flex-1">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                  {prop.name}
                                </code>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({prop.type})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-200" />

                {/* STEP 2 */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-base text-gray-900 mb-1">
                      Step 2: Create Notion Integration
                    </h3>
                    <p className="text-sm text-gray-500">
                      Connect your database to this widget
                    </p>
                  </div>

                  <ol className="text-sm text-gray-600 space-y-4">
                    <li>Go to Notion Integrations</li>
                    <li>Create new integration</li>
                    <li>
                      Copy token starting with <code>ntn_</code>
                    </li>
                    <li>Share database to the integration</li>
                    <li>Paste token in this form</li>
                  </ol>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-xs">
                      <strong>💡 Important:</strong> Database won’t appear if
                      integration has no access.
                    </p>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* TOKEN INPUT */}
      <div>
        <label className="text-sm">Notion Token</label>
        <div className="relative mt-2">
          <input
            value={notionUrl}
            onChange={handleTokenChange}
            placeholder="ntn_xxxxxxxxxxxx"
            className="w-full px-4 py-3 border rounded-lg"
          />
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
          <p className="text-sm font-medium">Select Database</p>
          {databases.map((db) => (
            <button
              key={db.id}
              onClick={() => {
                setSelectedDb(db);
                onSelectDb(db.id, db.name);
              }}
              className={`w-full p-4 border rounded-lg text-left ${
                selectedDb?.id === db.id
                  ? "border-purple-600 bg-purple-50"
                  : "hover:border-purple-400"
              }`}
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

      {/* CTA */}
      <button
        onClick={onCreateWidget}
        disabled={!selectedDb || !isUrlValid || loading}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Widget"}
      </button>
    </div>
  );
}
