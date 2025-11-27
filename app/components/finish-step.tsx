import { useState } from 'react';
import { Download, Copy, CheckCircle2, CreditCard, ChevronLeft } from 'lucide-react';

interface FinishStepProps {
  onPrev: () => void;
  embedUrl: string;
}

export function FinishStep({ onPrev, embedUrl }: FinishStepProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl text-gray-900">Almost Done!</h2>
            <p className="text-sm text-gray-600">Complete payment to get your embed code</p>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {!isPaid ? (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">Unlock Your Widget</h3>
              <p className="text-sm text-gray-600 mb-4">
                One-time payment to get lifetime access to your custom widget
              </p>
              <div className="text-3xl text-purple-600 mb-1">$9.99</div>
              <p className="text-xs text-gray-500">One-time payment</p>
            </div>
            <button
              onClick={handlePayment}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-green-900 mb-1">Payment Successful!</h4>
              <p className="text-xs text-green-700">
                Your widget is ready. Copy the embed code below.
              </p>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Embed Code
            </label>
            <div className="relative">
              <textarea
                value={embedCode}
                readOnly
                rows={4}
                className="w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-xs rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded border border-gray-600 flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm text-blue-900 mb-2">How to embed:</h4>
            <ol className="list-decimal ml-4 text-xs text-blue-800 space-y-1">
              <li>Copy the embed code above</li>
              <li>Open your Notion page</li>
              <li>Type /embed and press Enter</li>
              <li>Paste the code in the embed block</li>
              <li>Your widget will appear automatically!</li>
            </ol>
          </div>

          {/* Download Option */}
          <button className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download as HTML File
          </button>
        </>
      )}

      {/* Back Button */}
      <button
        onClick={onPrev}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full justify-center"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Customize
      </button>

      {/* Payment Modal */}
      
    </div>
  );
}
