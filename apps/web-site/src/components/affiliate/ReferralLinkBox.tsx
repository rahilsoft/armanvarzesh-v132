import React from "react";

const ReferralLinkBox: React.FC = () => {
  const link = "https://armanfit.ir/invite?ref=hossein";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("لینک کپی شد!");
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <p className="font-semibold mb-2">لینک دعوت شما:</p>
      <div className="flex items-center justify-between gap-2">
        <input type="text" value={link} readOnly className="w-full text-sm p-2 border rounded" />
        <button onClick={copyToClipboard} className="px-3 py-1 bg-blue-500 text-white rounded">
          کپی
        </button>
      </div>
    </div>
  );
};

export default ReferralLinkBox;