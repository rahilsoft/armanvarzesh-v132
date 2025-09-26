import React from "react";

const CommissionCard: React.FC = () => {
  const totalCommission = 1385000;
  const paid = 950000;
  const unpaid = totalCommission - paid;

  return (
    <div className="bg-green-50 border border-green-300 rounded p-6 mt-8 text-center">
      <h2 className="text-xl font-bold mb-4">درآمد شما از همکاری در فروش</h2>
      <div className="text-lg mb-2">مجموع کمیسیون: {totalCommission.toLocaleString()} تومان</div>
      <div className="text-md text-green-700">پرداخت‌شده: {paid.toLocaleString()} تومان</div>
      <div className="text-md text-red-600">در انتظار پرداخت: {unpaid.toLocaleString()} تومان</div>
    </div>
  );
};

export default CommissionCard;