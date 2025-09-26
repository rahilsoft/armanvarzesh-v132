import React from "react";

const LevelProgressBar: React.FC = () => {
  const progress = 68; // درصد پیشرفت تا سطح بعدی

  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-1">پیشرفت تا سطح بعدی</p>
      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
        <div className="bg-green-500 h-full" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-xs mt-1 text-right">{progress}%</p>
    </div>
  );
};

export default LevelProgressBar;