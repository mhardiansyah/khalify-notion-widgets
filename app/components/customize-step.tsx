import { Palette, Image, Type, Grid3x3, ChevronLeft } from 'lucide-react';

interface CustomizeStepProps {
  showMultimedia: boolean;
  setShowMultimedia: (show: boolean) => void;
  showTitle: boolean;
  setShowTitle: (show: boolean) => void;
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function CustomizeStep({
  showMultimedia,
  setShowMultimedia,
  showTitle,
  setShowTitle,
  gridColumns,
  setGridColumns,
  onNext,
  onPrev,
}: CustomizeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl text-gray-900">Customize Widget</h2>
            <p className="text-sm text-gray-600">Design your perfect widget layout</p>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <h3 className="text-sm text-gray-900">Display Options</h3>
        
        {/* Show Multimedia Toggle */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Show Multimedia</p>
                <p className="text-xs text-gray-500">Display images and videos</p>
              </div>
            </div>
            <button
              onClick={() => setShowMultimedia(!showMultimedia)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showMultimedia ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showMultimedia ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Show Title Toggle */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Show Title</p>
                <p className="text-xs text-gray-500">Display post titles</p>
              </div>
            </div>
            <button
              onClick={() => setShowTitle(!showTitle)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showTitle ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showTitle ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Grid3x3 className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm text-gray-900">Grid Layout</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[2, 3, 4].map((cols) => (
            <button
              key={cols}
              onClick={() => setGridColumns(cols)}
              className={`p-4 border rounded-lg transition-all ${
                gridColumns === cols
                  ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                  {Array.from({ length: cols }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded ${
                        gridColumns === cols ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{cols} Columns</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Continue to Finish
        </button>
      </div>
    </div>
  );
}
