import React from "react";

const SubscriptionRenewal: React.FC = () => {
  return (
    <div className="bg-white border p-4 rounded">
      <p className="text-sm font-semibold mb-2">تمدید عضویت VIP</p>
      <select className="w-full p-2 border rounded mb-2 text-sm">
        <option>۱ ماهه - ۱۲۰,۰۰۰ تومان</option>
        <option>۳ ماهه - ۳۰۰,۰۰۰ تومان</option>
        <option>۱۲ ماهه - ۹۰۰,۰۰۰ تومان</option>
      </select>
      <button className="bg-indigo-600 text-white px-4 py-2 w-full rounded text-sm hover:bg-indigo-700">
        پرداخت و تمدید عضویت
      </button>
    </div>
  );
};

export default SubscriptionRenewal;