import React from "react";

const reviews = [
  { user: "لیلا", comment: "مربی خیلی خوبیه و به‌موقع جواب می‌ده.", rating: 5 },
  { user: "نگار", comment: "برنامه‌اش واقعاً موثر بود. بدنم فرم گرفته.", rating: 4.5 },
];

const CoachReviewPanel: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h3 className="font-semibold mb-2">نظرات شاگردها</h3>
      <ul className="space-y-3 text-sm text-gray-700">
        {reviews.map((r, i) => (
          <li key={i} className="border-b pb-2">
            <p className="font-semibold">{r.user}</p>
            <p>{r.comment}</p>
            <p className="text-xs text-yellow-500 mt-1">⭐ {r.rating} / ۵</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoachReviewPanel;