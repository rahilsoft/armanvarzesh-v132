import React from "react";

const benefits = [
  "۵۰٪ تخفیف برای دوره‌های خاص",
  "دسترسی زودتر به دوره‌های جدید",
  "پاسخ اولویت‌دار مربیان",
  "گزارش‌های تحلیلی اختصاصی بدن",
  "هدیه ماهانه از فروشگاه"
];

const VipBenefitsList: React.FC = () => (
  <div className="bg-indigo-50 border p-4 rounded mb-4">
    <p className="text-sm font-semibold mb-2">مزایای عضویت VIP</p>
    <ul className="list-disc pl-5 text-sm text-gray-700">
      {benefits.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  </div>
);

export default VipBenefitsList;