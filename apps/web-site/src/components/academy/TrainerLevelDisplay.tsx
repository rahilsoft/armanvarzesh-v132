import React from "react";

const TrainerLevelDisplay: React.FC = () => {
  const level = "مربی حرفه‌ای (سطح ۲)";
  const badgeColor = "bg-blue-100 text-blue-700";

  return (
    <div className={`rounded p-3 border mb-4 ${badgeColor}`}>
      <p className="text-sm">سطح فعلی شما:</p>
      <p className="text-lg font-bold">{level}</p>
    </div>
  );
};

export default TrainerLevelDisplay;