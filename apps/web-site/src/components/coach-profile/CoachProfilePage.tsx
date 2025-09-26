import React from "react";
import CoachBioSection from "./CoachBioSection";
import CoachCoursesList from "./CoachCoursesList";
import CoachReviewPanel from "./CoachReviewPanel";

const CoachProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <CoachBioSection />
      <CoachCoursesList />
      <CoachReviewPanel />
    </div>
  );
};

export default CoachProfilePage;