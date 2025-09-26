import React from "react";

type Props = {
  level: "Beginner" | "Pro" | "Master";
};

const CoachLevelTag: React.FC<Props> = ({ level }) => {
  const color = level === "Master" ? "bg-purple-600" : level === "Pro" ? "bg-blue-600" : "bg-gray-400";
  return (
    <span className={`text-white text-xs px-2 py-1 rounded ${color}`}>
      {level === "Master" ? "مستر کوچ" : level === "Pro" ? "کوچ حرفه‌ای" : "مبتدی"}
    </span>
  );
};

export default CoachLevelTag;