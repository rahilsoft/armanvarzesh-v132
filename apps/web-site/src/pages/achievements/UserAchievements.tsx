import React from "react";
import XpProgressBar from "../../components/achievements/XpProgressBar";
import BadgeGrid from "../../components/achievements/BadgeGrid";

const UserAchievements: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-6">دستاوردها و امتیاز تجربه</h1>
      <XpProgressBar currentXp={850} level={4} xpToNext={1000} />
      <h2 className="text-xl font-bold mt-10 mb-4 text-center">نشان‌های شما</h2>
      <BadgeGrid />
    </div>
  );
};

export default UserAchievements;