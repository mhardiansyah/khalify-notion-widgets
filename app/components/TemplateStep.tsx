"use client";

interface TemplateStepProps {
  onConfirm: () => void;
}

export default function TemplateStep({ onConfirm }: TemplateStepProps) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-bold">Duplicate Content OS</h1>
      {/* <p className="text-gray-500">
        You can use our Notion template or your own database
      </p> */}

      <div className="flex justify-center gap-4">
        <a
          href="https://khlasify.myr.id/pl/content-starter"
          target="_blank"
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Get Template
        </a>

        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
