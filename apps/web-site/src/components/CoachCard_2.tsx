import React from "react";
const CoachCard: React.FC<{name:string, field:string, image:string}> = ({ name, field, image }) => (
  <div className="bg-white shadow rounded p-4 flex flex-col items-center w-[200px]">
    <img src={image} alt={name} className="rounded-full h-24 w-24 object-cover mb-3" />
    <div className="font-bold text-lg">{name}</div>
    <div className="text-blue-600">{field}</div>
  </div>
);
export default CoachCard;