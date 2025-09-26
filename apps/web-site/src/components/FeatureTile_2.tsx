import React from "react";
const FeatureTile: React.FC<{icon:string, title:string, description:string}> = ({ icon, title, description }) => (
  <div className="bg-white shadow rounded p-6 flex flex-col items-center text-center">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="font-bold text-lg mb-1">{title}</div>
    <div className="text-gray-500">{description}</div>
  </div>
);
export default FeatureTile;