import React from "react";
import QrCodeDisplay from "./QrCodeDisplay";
import CertificateDownload from "./CertificateDownload";

interface Props {
  title: string;
  date: string;
  coach: string;
  qrValue: string;
}

const CertificateCard: React.FC<Props> = ({ title, date, coach, qrValue }) => {
  return (
    <div className="bg-white rounded shadow p-6 border">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm">مربی: {coach}</p>
      <p className="text-sm">تاریخ صدور: {date}</p>
      <div className="my-4">
        <QrCodeDisplay value={qrValue} />
      </div>
      <CertificateDownload />
    </div>
  );
};

export default CertificateCard;