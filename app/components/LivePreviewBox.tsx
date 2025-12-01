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
      <div className="bg-gray-900 text-white rounded-xl p-4 shadow-inner h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Live Preview
            </p>
            <p className="text-sm text-gray-300">
              {hasEmbed
                ? "This is how your embed will look."
                : "Create a widget first to see the preview."}
            </p>
          </div>

          {db && (
            <span className="hidden md:inline-block text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300">
              DB: {db.slice(0, 6)}...{db.slice(-4)}
            </span>
          )}
        </div>

        <div className="flex-1 border border-gray-800 rounded-lg overflow-hidden bg-black">
          {hasEmbed ? (
            <iframe
              src={embedUrl as string}
              className="w-full h-full min-h-[380px]"
              style={{ border: "none" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center text-gray-500 text-sm">
              <p className="mb-1">No widget yet.</p>
              <p className="text-xs text-gray-600">
                Paste your Notion token, select a database, then click
                &quot;Create Widget&quot;.
              </p>
              {token && (
                <p className="mt-3 text-[10px] text-gray-500">
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
