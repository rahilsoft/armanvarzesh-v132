import React from "react";
import ReferralLinkBox from "../../components/affiliate/ReferralLinkBox";
import ReferralStats from "../../components/affiliate/ReferralStats";
import ReferralHistoryTable from "../../components/affiliate/ReferralHistoryTable";
import PayoutRequest from "../../components/affiliate/PayoutRequest";

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">داشبورد همکاری در فروش</h1>
      <ReferralLinkBox />
      <ReferralStats />
      <ReferralHistoryTable />
      <PayoutRequest />
    </div>
  );
};

export default Dashboard;