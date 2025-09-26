import React from "react";

const TrainerStatusOverview: React.FC = () => {
  const status = {
    level: "Silver",
    xp: 2400,
    activeClients: 11,
    satisfaction: 91,
    nextLevel: "Gold",
  };

  return (
    <div className="bg-white shadow rounded p-6 mb-8">
      <h3 className="text-lg font-bold mb-4">وضعیت فعلی مربی</h3>
      <ul className="space-y-2 text-sm">
        <li>سطح فعلی: {status.level}</li>
        <li>امتیاز تجربه (XP): {status.xp}</li>
        <li>کاربران فعال: {status.activeClients}</li>
        <li>میانگین رضایت: {status.satisfaction}%</li>
        <li>سطح بعدی: {status.nextLevel}</li>
      </ul>
    </div>
  );
};

export default TrainerStatusOverview;