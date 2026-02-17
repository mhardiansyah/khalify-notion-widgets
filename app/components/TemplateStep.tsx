"use client";

interface TemplateStepProps {
  onConfirm: () => void;
}

export default function TemplateStep({ onConfirm }: TemplateStepProps) {
  return (
    <div className="text-center space-y-5 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">
        Duplicate Content OS
      </h1>

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <a
          href="https://khlasify.myr.id/pl/content-starter"
          target="_blank"
          className="
            w-full sm:w-auto
            px-5 py-3
            bg-gray-200
            rounded-lg
            hover:bg-gray-300
            transition
          "
        >
          Get Template
        </a>

        <button
          onClick={onConfirm}
          className="
            w-full sm:w-auto
            px-5 py-3
            bg-purple-600
            text-white
            rounded-lg
            hover:bg-purple-700
            transition
          "
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
