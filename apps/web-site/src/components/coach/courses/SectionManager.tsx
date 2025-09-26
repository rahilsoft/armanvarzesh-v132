import React, { useState } from "react";
import LectureUploader from "./LectureUploader";

const SectionManager: React.FC = () => {
  const [sections, setSections] = useState([{ title: "", lectures: [] }]);

  return (
    <div className="bg-blue-50 p-6 rounded shadow mb-8">
      <h2 className="text-lg font-bold mb-4">مدیریت فصل‌ها و جلسات</h2>
      {sections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <input
            type="text"
            placeholder={`عنوان فصل ${idx + 1}`}
            value={section.title}
            onChange={(e) => {
              const updated = [...sections];
              updated[idx].title = e.target.value;
              setSections(updated);
            }}
            className="w-full p-2 border mb-2 rounded text-sm"
          />
          <LectureUploader sectionIndex={idx} />
        </div>
      ))}
      <button
        className="text-sm bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={() => setSections([...sections, { title: "", lectures: [] }])}
      >
        افزودن فصل جدید
      </button>
    </div>
  );
};

export default SectionManager;