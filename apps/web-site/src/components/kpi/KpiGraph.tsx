import React from "react";

const data = [
  { label: "فروردین", value: 12 },
  { label: "اردیبهشت", value: 19 },
  { label: "خرداد", value: 27 },
  { label: "تیر", value: 34 },
];

const KpiGraph: React.FC = () => {
  return (
    <div className="bg-white border p-4 rounded shadow mt-6">
      <h3 className="font-semibold mb-2">روند فروش دوره‌ها (۴ ماه اخیر)</h3>
      <div className="flex items-end space-x-4 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center justify-end">
            <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${d.value * 3}px` }}></div>
            <p className="text-xs mt-1">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KpiGraph;