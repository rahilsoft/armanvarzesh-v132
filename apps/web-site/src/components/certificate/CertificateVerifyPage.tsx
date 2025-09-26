import React from "react";
import { useParams } from "react-router-dom";

const CertificateVerifyPage: React.FC = () => {
  const { certId } = useParams<{ certId: string }>();

  // Simulate fetch
  const cert = {
    userName: "حسین امامی",
    courseTitle: "دوره تخصصی مربی‌گری قدرتی",
    date: "۱۴۰۳/۰۵/۱۵",
    valid: true,
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white border rounded mt-10 text-center">
      <h1 className="text-xl font-bold mb-4">اعتبارسنجی گواهی</h1>
      {cert.valid ? (
        <>
          <p className="text-green-600 font-semibold mb-2">✅ گواهی معتبر است</p>
          <p className="text-sm">نام: {cert.userName}</p>
          <p className="text-sm">دوره: {cert.courseTitle}</p>
          <p className="text-sm">تاریخ: {cert.date}</p>
        </>
      ) : (
        <p className="text-red-600">❌ گواهی یافت نشد یا نامعتبر است</p>
      )}
    </div>
  );
};

export default CertificateVerifyPage;