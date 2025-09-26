import React from "react";
import KpiComparisonCard from "./KpiComparisonCard";

const kpis = [
  { title: "فروش کل", value: "۳۵۰,۰۰۰,۰۰۰ تومان", trend: "+۱۸٪", color: "text-green-600" },
  { title: "کاربران فعال", value: "۲۸ نفر", trend: "+۹٪", color: "text-green-500" },
  { title: "میانگین رضایت", value: "۴.۷ / ۵", trend: "پایدار", color: "text-gray-600" },
  { title: "بازدید از پروفایل", value: "۸۴۵ بازدید", trend: "+۲۲٪", color: "text-green-600" },
];

const KpiOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <KpiComparisonCard key={index} title={kpi.title} value={kpi.value} trend={kpi.trend} color={kpi.color} />
      ))}
    </div>
  );
};

export default KpiOverview;