import React from "react";

const transactions = [
  { user: "کاربر ۱", date: "۱۴۰۳/۰۴/۱۲", amount: "۷۵,۰۰۰ تومان", status: "موفق" },
  { user: "کاربر ۲", date: "۱۴۰۳/۰۴/۱۰", amount: "۵۰,۰۰۰ تومان", status: "در انتظار" },
];

const ReferralTransactionsTable: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded border shadow-sm">
      <h3 className="font-semibold mb-3">تراکنش‌های شما</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 text-right">
            <th className="p-2 border">کاربر معرفی شده</th>
            <th className="p-2 border">تاریخ</th>
            <th className="p-2 border">مبلغ</th>
            <th className="p-2 border">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i}>
              <td className="p-2 border">{t.user}</td>
              <td className="p-2 border">{t.date}</td>
              <td className="p-2 border">{t.amount}</td>
              <td className="p-2 border">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralTransactionsTable;