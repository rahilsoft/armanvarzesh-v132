import React from "react";
import ReferralLinkBox from "./ReferralLinkBox";
import ReferralTransactionsTable from "./ReferralTransactionsTable";

const AffiliateDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">پنل همکاری در فروش</h2>
      <ReferralLinkBox />
      <ReferralTransactionsTable />
    </div>
  );
};

export default AffiliateDashboard;