import React from "react";

const certificates = [
  { title: "گواهی مربی سطح ۱", status: "✅ دریافت‌شده" },
  { title: "گواهی تغذیه ورزشی", status: "❌ دریافت نشده" },
  { title: "گواهی برنامه‌ریزی تمرین پیشرفته", status: "✅ دریافت‌شده" },
];

const CertificateList: React.FC = () => (
  <div className="bg-gray-50 p-6 rounded shadow">
    <h3 className="text-lg font-bold mb-4">گواهی‌نامه‌ها</h3>
    <ul className="space-y-2 text-sm">
      {certificates.map((c, i) => (
        <li key={i} className="flex justify-between border-b py-1">
          <span>{c.title}</span>
          <span>{c.status}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default CertificateList;