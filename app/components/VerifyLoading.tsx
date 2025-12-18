"use client";
export default function VerifyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Text */}
        <h1 className="text-xl font-semibold text-gray-900">
          Verifying magic link
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Tunggu bentar ya, lagi ngecek akses kamu 
        </p>
      </div>
    </div>
  );
}
