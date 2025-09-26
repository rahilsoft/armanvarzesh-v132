import React from "react";

const AffiliateDashboard: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-green-700 mb-4">🧲 داشبورد همکاری در فروش</h2>
      <p className="text-sm text-gray-600 mb-6">
        لینک اختصاصی شما برای جذب کاربر و کسب درآمد از ثبت‌نام‌های موفق:
      </p>
      <div className="bg-gray-100 rounded p-2 border text-xs font-mono">
        https://armanfit.ir/invite/sepideh123
      </div>
      <div className="mt-6">
        <h3 className="font-semibold text-sm mb-2">درآمد کسب‌شده:</h3>
        <p className="text-lg font-bold text-green-600">۳،۲۰۰،۰۰۰ تومان</p>
      </div>
    </div>
  );
};

export default AffiliateDashboard;