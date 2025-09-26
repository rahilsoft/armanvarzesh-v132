import React from "react";

const KPIS = [
  { label: "نرخ پایبندی", value: "87%", color: "bg-green-100 text-green-700" },
  { label: "میانگین تمرین در هفته", value: "4.3 جلسه", color: "bg-blue-100 text-blue-700" },
  { label: "میانگین کالری مصرفی", value: "2200 Kcal", color: "bg-yellow-100 text-yellow-800" },
  { label: "نرخ بهبود قدرت", value: "+18%", color: "bg-purple-100 text-purple-800" },
];

const KpiOverview: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
    {KPIS.map((kpi, idx) => (
      <div key={idx} className={`p-6 rounded shadow text-center ${kpi.color}`}>
        <div className="text-xl font-bold">{kpi.value}</div>
        <div className="text-sm mt-1">{kpi.label}</div>
      </div>
    ))}
  </div>
);

export default KpiOverview;