import React from "react";

const XpProgressBar: React.FC = () => {
  const xp = 2100;
  const nextLevel = 3000;

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold mb-1">امتیاز فعلی: {xp} XP</p>
      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
        <div className="bg-blue-500 h-full" style={{ width: `${(xp / nextLevel) * 100}%` }}></div>
      </div>
      <p className="text-xs mt-1 text-right">سطح بعدی در {nextLevel} XP</p>
    </div>
  );
};

export default XpProgressBar;