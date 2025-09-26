import React from "react";
import QRCode from "qrcode.react";

interface Props {
  value: string;
}

const QrCodeDisplay: React.FC<Props> = ({ value }) => (
  <div className="flex justify-center">
    <QRCode value={value} size={128} level="H" />
  </div>
);

export default QrCodeDisplay;