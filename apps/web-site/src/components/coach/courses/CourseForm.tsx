import React, { useState } from "react";

const CourseForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState<File | null>(null);

  return (
    <div className="bg-white shadow p-6 rounded mb-8">
      <h2 className="text-lg font-bold mb-4">مشخصات دوره</h2>
      <input
        type="text"
        placeholder="عنوان دوره"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border mb-3 rounded text-sm"
      />
      <textarea
        placeholder="توضیحات دوره"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full p-2 border mb-3 rounded text-sm"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files?.[0] || null)}
        className="text-sm"
      />
    </div>
  );
};

export default CourseForm;