import React from "react";

const UpgradeRequirements: React.FC = () => {
  const requirements = [
    "داشتن حداقل ۱۰ کاربر فعال",
    "گذراندن دوره آموزشی سطح ۲",
    "داشتن امتیاز XP بالای ۲۵۰۰",
    "میانگین رضایت کاربران بالای ۸۵٪",
  ];

  return (
    <div className="bg-blue-50 rounded p-6 shadow mb-8">
      <h3 className="text-lg font-bold mb-4">پیش‌نیازهای ارتقا به سطح Gold</h3>
      <ul className="list-disc list-inside text-sm space-y-1">
        {requirements.map((r, idx) => (
          <li key={idx}>{r}</li>
        ))}
      </ul>
    </div>
  );
};

export default UpgradeRequirements;