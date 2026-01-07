"use client";

import { ExternalLink, HelpCircle } from "lucide-react";

interface CreateTokenStepProps {
  onNext: () => void;
}

export default function CreateTokenStep({ onNext }: CreateTokenStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Create Notion Integration</h2>

      <ol className="list-decimal pl-5 text-gray-600 space-y-2">
        <li>Open Notion → Settings → Integrations</li>
        <li>Create a new integration</li>
        <li>Copy token starting with <code>ntn_</code></li>
        <li>Share your database to the integration</li>
      </ol>

      <a
        href="https://www.notion.so/my-integrations"
        target="_blank"
        className="inline-flex items-center gap-2 text-purple-600"
      >
        <ExternalLink className="w-4 h-4" />
        Go to Notion Integrations
      </a>

      <button
        onClick={onNext}
        className="w-full mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        I’ve Created the Token →
      </button>
    </div>
  );
}
