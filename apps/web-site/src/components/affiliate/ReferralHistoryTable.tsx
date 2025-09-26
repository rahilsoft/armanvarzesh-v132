import React from "react";

const data = [
  { id: 1, user: "کاربر ۱", date: "۱۴۰۳/۰۴/۰۵", amount: "۱۲۰,۰۰۰ تومان", status: "پرداخت‌شده" },
  { id: 2, user: "کاربر ۲", date: "۱۴۰۳/۰۴/۱۰", amount: "۱۸۰,۰۰۰ تومان", status: "در انتظار" }
];

const ReferralHistoryTable: React.FC = () => (
  <div className="bg-white border rounded p-4 mb-6">
    <h2 className="text-sm font-bold mb-2">تاریخچه درآمد</h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-gray-600">
          <th className="text-right py-2">کاربر</th>
          <th className="text-right">تاریخ</th>
          <th className="text-right">مبلغ</th>
          <th className="text-right">وضعیت</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-b">
            <td className="py-2">{row.user}</td>
            <td>{row.date}</td>
            <td>{row.amount}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReferralHistoryTable;