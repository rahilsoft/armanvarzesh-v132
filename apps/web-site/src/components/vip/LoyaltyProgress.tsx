import React from "react";

const LoyaltyProgress: React.FC = () => {
  const xp = 1250;
  const nextLevel = 1500;

  return (
    <div className="bg-white border p-4 rounded mb-4">
      <p className="text-sm font-semibold mb-2">پیشرفت امتیاز وفاداری</p>
      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
        <div className="bg-green-500 h-full" style={{ width: `${(xp / nextLevel) * 100}%` }}></div>
      </div>
      <p className="text-xs mt-2">XP {xp} / {nextLevel}</p>
    </div>
  );
};

export default LoyaltyProgress;