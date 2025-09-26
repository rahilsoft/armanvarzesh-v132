import React from "react";
const PlanCard: React.FC<{title:string, price:string, features:string[]}> = ({ title, price, features }) => (
  <div className="bg-white rounded shadow p-6 w-[270px] flex flex-col items-center">
    <div className="text-xl font-bold mb-2">{title}</div>
    <div className="text-2xl text-blue-700 mb-4">{price} تومان</div>
    <ul className="mb-4">
      {features.map(f => <li key={f} className="text-gray-500">• {f}</li>)}
    </ul>
    <button className="btn-primary px-6 py-2 rounded">انتخاب</button>
  </div>
);
export default PlanCard;