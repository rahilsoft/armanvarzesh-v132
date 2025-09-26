import React from "react";
import QRCode from "react-qr-code";

type Props = {
  link: string;
};

const QRGenerator: React.FC<Props> = ({ link }) => {
  return (
    <div className="bg-white p-1 rounded shadow border">
      <QRCode value={link} size={64} />
    </div>
  );
};

export default QRGenerator;