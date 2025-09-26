import React from "react";

const courses = [
  { title: "دوره چربی‌سوزی بانوان", price: "۹۸۰,۰۰۰ تومان", duration: "۶ هفته" },
  { title: "دوره HIIT ترکیبی", price: "۱,۴۵۰,۰۰۰ تومان", duration: "۸ هفته" },
];

const CoachCoursesList: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h3 className="font-semibold mb-2">دوره‌های مربی</h3>
      <ul className="space-y-2">
        {courses.map((course, i) => (
          <li key={i} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{course.title}</p>
              <p className="text-xs text-gray-500">{course.duration}</p>
            </div>
            <span className="text-sm text-green-600 font-semibold">{course.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoachCoursesList;