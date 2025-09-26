import React from "react";

type Props = {
  currentXP: number;
  nextLevelXP: number;
  level: number;
};

const LevelProgress: React.FC<Props> = ({ currentXP, nextLevelXP, level }) => {
  const percentage = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <div className="bg-white p-4 rounded shadow border space-y-2">
      <h3 className="font-semibold text-lg">سطح فعلی: {level}</h3>
      <div className="w-full bg-gray-200 rounded h-4">
        <div className="bg-yellow-500 h-4 rounded" style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="text-xs text-gray-500">تجربه: {currentXP} / {nextLevelXP}</p>
    </div>
  );
};

export default LevelProgress;