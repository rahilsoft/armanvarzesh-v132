import React from "react";
import CourseForm from "../../../components/coach/courses/CourseForm";
import SectionManager from "../../../components/coach/courses/SectionManager";
import PreviewPanel from "../../../components/coach/courses/PreviewPanel";

const CourseBuilder: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">ساخت دوره آموزشی</h1>
      <CourseForm />
      <SectionManager />
      <PreviewPanel />
    </div>
  );
};

export default CourseBuilder;