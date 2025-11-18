"use client";

import { useState, useEffect } from "react";
import NotionConnectForm from "@/app/components/NotionConnectForm";

export default function CreateWidgetPage() {
  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // state untuk feedback "Copied!"
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // copy function
  const copyText = async (text: string, type: "url" | "html") => {
    await navigator.clipboard.writeText(text);

    if (type === "url") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 1500);
    }
  };

  // AUTO GENERATE EMBED WHEN token + db ready
  useEffect(() => {
    if (!token || !db) return;

    const generate = async () => {
      setLoading(true);
      const res = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, db }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setEmbedUrl(data.embedUrl);
      }
    };

    generate();
  }, [token, db]);

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Create Widget</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="bg-gray-900 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold">Notion Setup</h2>

          {!token || !db ? (
            <NotionConnectForm
              onReady={({ token, db }) => {
                setToken(token);
                setDb(db);
              }}
            />
          ) : (
            <>
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  <strong>Token:</strong> {token.slice(0, 4)}••••••
                </p>
                <p>
                  <strong>Database:</strong> {db}
                </p>
              </div>

              {loading && (
                <p className="text-purple-400 text-sm">
                  ⏳ Generating embed link…
                </p>
              )}

              {embedUrl && (
                <>
                  {/* EMBED URL */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1 flex items-center justify-between">
                      Embed URL:
                      <button
                        onClick={() => copyText(embedUrl, "url")}
                        className="text-xs bg-purple-600 px-2 py-1 rounded hover:bg-purple-700 transition"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </p>

                    <a
                      href={embedUrl}
                      className="text-purple-400 underline break-all"
                      target="_blank"
                    >
                      {embedUrl}
                    </a>
                  </div>

                  {/* EMBED HTML */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 flex items-center justify-between">
                      Embed HTML:
                      <button
                        onClick={() =>
                          copyText(
                            `<iframe src="${embedUrl}" style="width:100%;height:600px;border:0;" frameborder="0"></iframe>`,
                            "html"
                          )
                        }
                        className="text-xs bg-purple-600 px-2 py-1 rounded hover:bg-purple-700 transition"
                      >
                        {copiedHtml ? "Copied!" : "Copy"}
                      </button>
                    </p>

                    <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto">
                                              {`<iframe src="${embedUrl}"
                                                     style="width:100%;height:600px;border:0;"
  frameborder="0"
></iframe>`}
                    </pre>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* RIGHT SIDE — IFRAME PREVIEW */}
        <div className="bg-gray-900 p-6 rounded-xl min-h-[600px]">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

          {!embedUrl ? (
            <p className="text-gray-500">Fill the form to load preview…</p>
          ) : (
            <iframe
              src={embedUrl}
              style={{
                width: "100%",
                height: "600px",
                border: "0",
                borderRadius: "8px",
                background: "#111",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
