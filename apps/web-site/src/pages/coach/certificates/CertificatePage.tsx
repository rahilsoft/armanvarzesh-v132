import React from "react";
import CertificateCard from "../../../components/coach/certificates/CertificateCard";

const certificates = [
  {
    id: "cert1",
    title: "گواهی مربی سطح ۲",
    date: "۱۴۰۳/۰۴/۰۱",
    coach: "حسین ایمانی",
    qrValue: "https://armanfit.ir/cert/verify/cert1"
  },
  {
    id: "cert2",
    title: "گواهی تغذیه ورزشی",
    date: "۱۴۰۳/۰۴/۲۰",
    coach: "حسین ایمانی",
    qrValue: "https://armanfit.ir/cert/verify/cert2"
  }
];

const CertificatePage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">گواهینامه‌های من</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} {...cert} />
        ))}
      </div>
    </div>
  );
};

export default CertificatePage;