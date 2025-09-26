import React from "react";
import BadgeCard from "./BadgeCard";

const badges = [
  { name: "ورزشکار منظم", earned: true, icon: "🏅" },
  { name: "پیشرفته", earned: false, icon: "🚀" },
  { name: "چالش‌پذیر", earned: true, icon: "🔥" },
  { name: "دعوت‌کننده", earned: false, icon: "🤝" },
];

const BadgeGrid: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
    {badges.map((badge, idx) => (
      <BadgeCard key={idx} {...badge} />
    ))}
  </div>
);

export default BadgeGrid;