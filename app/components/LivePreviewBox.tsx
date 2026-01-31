"use client";

interface LivePreviewBoxProps {
  embedUrl?: string | null;
  token?: string | null;
  db?: string | null;
}

export default function LivePreviewBox({
  embedUrl,
  token,
  db,
}: LivePreviewBoxProps) {
  const hasEmbed = !!embedUrl;

  return (
    <div className="w-full h-full">
      <div className="bg-purple-50 text-gray-800 rounded-xl p-4 shadow-sm h-full flex flex-col border border-purple-200">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-500">
              Live Preview
            </p>
            <p className="text-sm text-purple-700">
              {hasEmbed
                ? "This is how your embed will look."
                : "Create a widget first to see the preview."}
            </p>
          </div>

          {db && (
            <span className="hidden md:inline-block text-[10px] px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              DB: {db.slice(0, 6)}...{db.slice(-4)}
            </span>
          )}
        </div>

        {/* PREVIEW FRAME */}
        <div className="flex-1 border border-purple-200 rounded-lg overflow-hidden bg-white">
          {hasEmbed ? (
            <iframe
              src={embedUrl as string}
              className="w-full h-full min-h-[380px]"
              style={{ border: "none" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center text-purple-400 text-sm text-center px-4">
              <p className="mb-1 font-medium text-purple-500">
                No widget yet
              </p>
              <p className="text-xs text-purple-400">
                Paste your Notion token, select a database, then click
                &quot;Create Widget&quot;.
              </p>

              {token && (
                <p className="mt-3 text-[10px] text-purple-300">
                  Token set • waiting for widget creation…
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
