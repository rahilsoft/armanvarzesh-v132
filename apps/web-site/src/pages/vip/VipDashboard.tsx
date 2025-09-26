import React from "react";
import VipStatusCard from "../../components/vip/VipStatusCard";
import LoyaltyProgress from "../../components/vip/LoyaltyProgress";
import VipBenefitsList from "../../components/vip/VipBenefitsList";
import SubscriptionRenewal from "../../components/vip/SubscriptionRenewal";

const VipDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">باشگاه VIP</h1>
      <VipStatusCard />
      <LoyaltyProgress />
      <VipBenefitsList />
      <SubscriptionRenewal />
    </div>
  );
};

export default VipDashboard;