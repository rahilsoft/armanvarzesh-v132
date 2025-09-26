import React from "react";

interface Props {
  name: string;
  earned: boolean;
  icon: string;
}

const BadgeCard: React.FC<Props> = ({ name, earned, icon }) => (
  <div className={`p-4 rounded shadow text-center ${earned ? "bg-yellow-100" : "bg-gray-100 opacity-50"}`}>
    <div className="text-4xl mb-2">{icon}</div>
    <div className="font-bold">{name}</div>
    <div className="text-sm mt-1">{earned ? "فعال شده ✅" : "قفل 🔒"}</div>
  </div>
);

export default BadgeCard;