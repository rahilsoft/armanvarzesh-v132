import React from "react";
import ReferralInvite from "../../components/affiliate/ReferralInvite";
import ReferralStats from "../../components/affiliate/ReferralStats";
import CommissionCard from "../../components/affiliate/CommissionCard";

const AffiliateDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">داشبورد همکاری در فروش</h1>
      <ReferralInvite />
      <div className="my-10">
        <ReferralStats />
      </div>
      <CommissionCard />
    </div>
  );
};

export default AffiliateDashboard;