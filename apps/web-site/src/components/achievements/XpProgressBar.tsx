import React from "react";

interface Props {
  currentXp: number;
  xpToNext: number;
  level: number;
}

const XpProgressBar: React.FC<Props> = ({ currentXp, xpToNext, level }) => {
  const percentage = Math.min(100, (currentXp / xpToNext) * 100);
  return (
    <div className="bg-white border rounded p-4 shadow max-w-xl mx-auto text-center">
      <div className="text-lg font-bold mb-2">سطح فعلی: {level}</div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-sm text-gray-600 mt-1">{currentXp} / {xpToNext} XP</div>
    </div>
  );
};

export default XpProgressBar;