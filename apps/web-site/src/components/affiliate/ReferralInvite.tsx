import React from "react";

const ReferralInvite: React.FC = () => {
  const referralCode = "hossein123";
  const referralLink = `https://armanfit.com/?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert("لینک کپی شد!");
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">لینک دعوت اختصاصی شما</h2>
      <div className="bg-white p-4 rounded border inline-block">
        <code>{referralLink}</code>
      </div>
      <div className="mt-4">
        <button onClick={copyToClipboard} className="btn-primary px-6 py-2">کپی لینک</button>
      </div>
    </div>
  );
};

export default ReferralInvite;