import React from "react";

interface Props {
  currentLevel: string;
}

const TrainerBadge: React.FC<Props> = ({ currentLevel }) => (
  <div className="inline-block bg-indigo-50 border px-6 py-3 rounded shadow text-center">
    <p className="text-sm mb-1">نشان سطح فعلی</p>
    <span className="text-xl font-bold text-indigo-700">{currentLevel}</span>
  </div>
);

export default TrainerBadge;