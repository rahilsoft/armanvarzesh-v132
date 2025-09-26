import React from "react";

const sessions = [
  { date: "1403/05/01", user: "محمدرضا", type: "تمرین قدرتی", duration: "45 دقیقه", result: "انجام شد" },
  { date: "1403/05/02", user: "سارا", type: "هوازی", duration: "30 دقیقه", result: "انجام نشد" },
];

const SessionReportTable: React.FC = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">تاریخ</th>
          <th className="p-2 border">کاربر</th>
          <th className="p-2 border">نوع تمرین</th>
          <th className="p-2 border">مدت</th>
          <th className="p-2 border">وضعیت</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((s, i) => (
          <tr key={i}>
            <td className="border p-2">{s.date}</td>
            <td className="border p-2">{s.user}</td>
            <td className="border p-2">{s.type}</td>
            <td className="border p-2">{s.duration}</td>
            <td className="border p-2">{s.result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SessionReportTable;