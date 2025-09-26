import React from "react";

const criteria = [
  "فروش ۵ دوره آموزشی در ۳ ماه اخیر",
  "دریافت حداقل ۹۰٪ رضایت از کاربران",
  "گذراندن دوره «رفتار حرفه‌ای با مشتری»",
];

const LevelUpgradeCriteria: React.FC = () => {
  return (
    <div className="border p-4 rounded bg-white shadow mb-4">
      <h3 className="font-semibold mb-2">شرایط ارتقا به سطح بعدی</h3>
      <ul className="list-disc text-sm text-gray-700 pl-5">
        {criteria.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </div>
  );
};

export default LevelUpgradeCriteria;