import React from "react";

type Props = {
  badge: {
    id: number;
    title: string;
    description: string;
    earned: boolean;
  };
};

const AchievementCard: React.FC<Props> = ({ badge }) => {
  return (
    <div className={`p-4 border rounded shadow ${badge.earned ? "bg-green-50" : "bg-gray-100 opacity-70"}`}>
      <h3 className="text-lg font-semibold">{badge.title}</h3>
      <p className="text-sm">{badge.description}</p>
      <p className="text-xs mt-2">{badge.earned ? "✅ دریافت شده" : "🔒 قفل شده"}</p>
    </div>
  );
};

export default AchievementCard;