import React from "react";

const CoachBioSection: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow-sm border space-y-2">
      <div className="flex items-center space-x-4">
        <img src="/coach-avatar.jpg" alt="مربی" className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-xl font-bold">سپیده نادری</h2>
          <p className="text-sm text-gray-600">مربی تخصصی چربی‌سوزی و بدنسازی بانوان</p>
          <p className="text-xs text-gray-500 mt-1">📍 تهران | 🏅 سطح: Master Coach</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-4">
        من مربی رسمی آرمان ورزش با ۷ سال سابقه حرفه‌ای هستم. تمرکزم روی اصلاح فرم، برنامه ترکیبی برای بانوان، و رسیدن به نتایج قابل اندازه‌گیری هست.
      </p>
    </div>
  );
};

export default CoachBioSection;