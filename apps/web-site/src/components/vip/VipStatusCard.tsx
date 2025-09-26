import React from "react";

const VipStatusCard: React.FC = () => {
  const level = "طلایی";
  const expiry = "۱۴۰۳/۱۲/۲۹";

  return (
    <div className="bg-yellow-50 border-yellow-400 border p-4 rounded mb-4">
      <p className="text-lg font-semibold">سطح فعلی شما: {level}</p>
      <p className="text-sm">تاریخ انقضای عضویت: {expiry}</p>
    </div>
  );
};

export default VipStatusCard;