import React from "react";
import AchievementCard from "./AchievementCard";

const badges = [
  { id: 1, title: "مربی طلایی", description: "فروش بیش از ۵ دوره", earned: true },
  { id: 2, title: "ورزشکار فعال", description: "شرکت در ۳۰ جلسه تمرینی", earned: false },
  { id: 3, title: "دعوت‌کننده حرفه‌ای", description: "دعوت ۱۰ کاربر به اپلیکیشن", earned: true },
];

const BadgeList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <AchievementCard key={badge.id} badge={badge} />
      ))}
    </div>
  );
};

export default BadgeList;