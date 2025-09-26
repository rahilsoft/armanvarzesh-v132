import React from "react";

const badges = [
  { name: "🏆 ورزشکار فعال", desc: "شرکت در ۳۰ تمرین" },
  { name: "💪 بدنساز حرفه‌ای", desc: "ثبت ۵ دوره قدرتی" },
  { name: "🔥 چالش‌گر", desc: "شرکت در ۳ چالش عمومی" },
];

const BadgeList: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow border">
      <h3 className="font-semibold mb-2">نشان‌های کسب‌شده</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {badges.map((badge, i) => (
          <li key={i} className="border rounded p-2">
            <p className="font-bold">{badge.name}</p>
            <p className="text-xs text-gray-500">{badge.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BadgeList;