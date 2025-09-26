import React from "react";

const ReferralStats: React.FC = () => {
  const stats = {
    invited: 34,
    registered: 21,
    paid: 12,
    totalIncome: "1,350,000 تومان"
  };

  return (
    <div className="bg-blue-50 p-4 rounded mb-6 grid grid-cols-2 gap-4 text-sm">
      <div>کاربران دعوت‌شده: {stats.invited}</div>
      <div>ثبت‌نام شده‌ها: {stats.registered}</div>
      <div>خرید موفق: {stats.paid}</div>
      <div>درآمد کل: {stats.totalIncome}</div>
    </div>
  );
};

export default ReferralStats;