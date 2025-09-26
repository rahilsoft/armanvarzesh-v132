import React from "react";
import KpiOverview from "../../../components/coach/analytics/KpiOverview";
import PerformanceChart from "../../../components/coach/analytics/PerformanceChart";
import SessionReportTable from "../../../components/coach/analytics/SessionReportTable";
import ClientProgressCard from "../../../components/coach/analytics/ClientProgressCard";
import AiWarningBanner from "../../../components/coach/analytics/AiWarningBanner";

const CoachDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">داشبورد تحلیلی مربی</h1>
      <AiWarningBanner />
      <KpiOverview />
      <div className="my-10">
        <PerformanceChart />
      </div>
      <div className="my-10">
        <SessionReportTable />
      </div>
      <div className="my-10">
        <ClientProgressCard />
      </div>
    </div>
  );
};

export default CoachDashboard;