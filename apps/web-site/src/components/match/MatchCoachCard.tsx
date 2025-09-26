import React from "react";

type Props = {
  name: string;
  match: number;
  specialty: string;
  location: string;
  gender: string;
};

const MatchCoachCard: React.FC<Props> = ({ name, match, specialty, location, gender }) => {
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">تطابق {match}%</span>
      </div>
      <p className="text-sm text-gray-600">{specialty}</p>
      <p className="text-xs mt-2 text-gray-500">🧭 {location} | 👤 {gender}</p>
      <button className="mt-3 w-full bg-blue-600 text-white text-sm py-1 rounded">مشاهده پروفایل</button>
    </div>
  );
};

export default MatchCoachCard;