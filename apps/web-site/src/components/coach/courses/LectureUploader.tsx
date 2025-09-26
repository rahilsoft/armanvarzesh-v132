import React from "react";

interface Props {
  sectionIndex: number;
}

const LectureUploader: React.FC<Props> = ({ sectionIndex }) => {
  return (
    <div className="border p-4 rounded bg-white mb-4">
      <p className="text-sm font-semibold mb-2">جلسه جدید برای فصل {sectionIndex + 1}</p>
      <input type="text" placeholder="عنوان جلسه" className="w-full p-2 mb-2 border rounded text-sm" />
      <input type="file" accept="video/*,.pdf" className="text-sm" />
    </div>
  );
};

export default LectureUploader;