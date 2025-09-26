import React from "react";

const VerifiedCoach: React.FC = () => {
  return (
    <div className="bg-white p-4 border shadow rounded text-sm">
      <div className="flex items-center space-x-2">
        <span className="text-blue-600 text-lg">✔️</span>
        <p className="text-gray-700">مربی تاییدشده رسمی با تیک آبی</p>
      </div>
    </div>
  );
};

export default VerifiedCoach;