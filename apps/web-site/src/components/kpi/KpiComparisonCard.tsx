import React from "react";

type Props = {
  title: string;
  value: string;
  trend: string;
  color?: string;
};

const KpiComparisonCard: React.FC<Props> = ({ title, value, trend, color }) => {
  return (
    <div className="p-4 bg-white border rounded shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
      <p className={`text-xs mt-1 ${color}`}>{trend}</p>
    </div>
  );
};

export default KpiComparisonCard;