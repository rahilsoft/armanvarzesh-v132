import React from "react";

interface Props {
  level: string;
  requirements: string;
  status: string;
}

const TrainerLevelCard: React.FC<Props> = ({ level, requirements, status }) => {
  return (
    <div className="bg-white p-6 rounded border shadow text-center">
      <h4 className="text-xl font-bold mb-2">{level}</h4>
      <p className="text-sm mb-3">{requirements}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${status === "کامل شده" ? "bg-green-100 text-green-800" : status === "در حال انجام" ? "bg-yellow-100 text-yellow-800" : "bg-gray-200 text-gray-700"}`}>
        {status}
      </span>
    </div>
  );
};

export default TrainerLevelCard;