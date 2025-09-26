import React from "react";
import TrainerStatusOverview from "../../../components/coach/academy/TrainerStatusOverview";
import UpgradeRequirements from "../../../components/coach/academy/UpgradeRequirements";
import CertificateList from "../../../components/coach/academy/CertificateList";

const TrainerAcademy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">آکادمی مربیان آرمان ورزش</h1>
      <TrainerStatusOverview />
      <UpgradeRequirements />
      <CertificateList />
    </div>
  );
};

export default TrainerAcademy;