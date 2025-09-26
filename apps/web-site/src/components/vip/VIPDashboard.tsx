import React from "react";
import LevelProgress from "./LevelProgress";
import BadgeList from "./BadgeList";

const VIPDashboard: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold text-center text-yellow-600">🎖️ باشگاه VIP آرمان ورزش</h2>
      <LevelProgress currentXP={1800} nextLevelXP={2500} level={4} />
      <BadgeList />
    </div>
  );
};

export default VIPDashboard;