import React from "react";

const AiWarningBanner: React.FC = () => {
  const warnings = [
    "⚠️ کاربر محمدرضا ۲ تمرین متوالی را انجام نداده.",
    "⚠️ کاربر سارا افت سطح قدرت در ۲ هفته اخیر داشته.",
  ];

  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8">
      <h3 className="font-bold mb-2">هشدارهای تحلیل هوشمند</h3>
      <ul className="list-disc list-inside">
        {warnings.map((warning, idx) => (
          <li key={idx}>{warning}</li>
        ))}
      </ul>
    </div>
  );
};

export default AiWarningBanner;