import React from "react";

const ReferralInviteCard: React.FC = () => {
  return (
    <div className="bg-white shadow border rounded p-4 space-y-2">
      <h3 className="font-bold text-sm">دعوت دوستان</h3>
      <p className="text-xs text-gray-600">
        با دعوت دوستان خود، ۱۰٪ از خرید اول آن‌ها را هدیه بگیرید.
      </p>
      <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded">کپی لینک دعوت</button>
    </div>
  );
};

export default ReferralInviteCard;