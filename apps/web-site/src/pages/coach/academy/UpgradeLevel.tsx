import React from "react";
import TrainerLevelCard from "../../../components/coach/academy/TrainerLevelCard";
import TrainerBadge from "../../../components/coach/academy/TrainerBadge";

const UpgradeLevel: React.FC = () => {
  const levels = [
    { level: "Bronze", requirements: "تکمیل ۵ برنامه تمرینی", status: "کامل شده" },
    { level: "Silver", requirements: "داشتن ۱۰ کاربر فعال + گواهی سطح ۲", status: "در حال انجام" },
    { level: "Gold", requirements: "نرخ رضایت بالای ۹۰٪", status: "قفل" },
  ];

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">ارتقای سطح مربی</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {levels.map((lvl, i) => (
          <TrainerLevelCard key={i} {...lvl} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <TrainerBadge currentLevel="Silver" />
      </div>
    </div>
  );
};

export default UpgradeLevel;