import React from "react";
import MatchCoachCard from "./MatchCoachCard";
import MatchExplanation from "./MatchExplanation";

const coaches = [
  { name: "سپیده نادری", match: 96, specialty: "چربی‌سوزی و فرم‌دهی", location: "تهران", gender: "زن" },
  { name: "علیرضا جعفری", match: 89, specialty: "عضله‌سازی حرفه‌ای", location: "اصفهان", gender: "مرد" },
];

const CoachMatchPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">مربی مناسب شما</h2>
      <MatchExplanation />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map((coach, index) => (
          <MatchCoachCard key={index} {...coach} />
        ))}
      </div>
    </div>
  );
};

export default CoachMatchPage;