"use client";

interface ProgressBarProps {
  filled: number;
  total: number;
}

export default function ProgressBar({ filled, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;

  return (
    <div className="bg-white border-b border-poalim-border px-5 py-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-poalim-gray">
          התקדמות מילוי הבקשה
        </span>
        <span className="text-xs font-bold text-poalim-red">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out bg-poalim-red"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage === 100 && (
        <p className="text-[11px] text-green-600 font-medium mt-1">
          ✓ כל השדות הנדרשים מולאו
        </p>
      )}
    </div>
  );
}
