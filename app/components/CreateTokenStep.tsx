"use client";

interface CreateTokenStepProps {
  onNext: () => void;
}

export default function CreateTokenStep({ onNext }: CreateTokenStepProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">
        Connect Your Database
      </h2>

      <ol className="list-decimal pl-5 text-sm sm:text-base text-gray-600 space-y-2">
        <li>
          <a
            href="https://www.notion.so/my-integrations"
            target="_blank"
            className="inline-flex items-center gap-2 text-purple-600 hover:underline"
          >
            Go to Notion Integrations
          </a>
        </li>
        <li>Create a new integration</li>
        <li>
          Copy token starting with <code className="px-1 bg-gray-100 rounded">ntn_</code>
        </li>
        <li>Connect your Content OS to the integration</li>
      </ol>

      <button
        onClick={onNext}
        className="
          w-full
          mt-4 sm:mt-6
          px-6 py-3
          bg-purple-600 text-white
          rounded-lg
          hover:bg-purple-700
          transition
        "
      >
        I’ve Created the Token →
      </button>
    </div>
  );
}
