import React from "react";

type Props = {
  certId: string;
};

const CertificateQrPreview: React.FC<Props> = ({ certId }) => {
  const qrUrl = `https://armanfit.ir/certificate/verify/${certId}`;

  return (
    <div className="mt-4">
      <p className="text-xs mb-1">اسکن کد QR برای اعتبارسنجی:</p>
      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrUrl)}`} alt="QR Code" />
      <p className="text-xs mt-1">لینک مستقیم: <a href={qrUrl} className="text-blue-600 underline" target="_blank" rel="noreferrer">{qrUrl}</a></p>
    </div>
  );
};

export default CertificateQrPreview;