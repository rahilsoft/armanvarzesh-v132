import React from "react";
import CertificateQrPreview from "./CertificateQrPreview";

type Props = {
  cert: {
    id: string;
    userName: string;
    courseTitle: string;
    date: string;
  };
};

const CertificateCard: React.FC<Props> = ({ cert }) => (
  <div className="border p-4 rounded shadow bg-white mb-4">
    <h3 className="text-lg font-bold">گواهی پایان دوره</h3>
    <p className="text-sm mt-2">نام: {cert.userName}</p>
    <p className="text-sm">دوره: {cert.courseTitle}</p>
    <p className="text-sm">تاریخ: {cert.date}</p>
    <CertificateQrPreview certId={cert.id} />
  </div>
);

export default CertificateCard;