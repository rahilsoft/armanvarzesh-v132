import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  value: string;
}

const QrCodeDisplay: React.FC<Props> = ({ value }) => (
  <div className="flex justify-center">
    <QRCodeSVG value={value} size={128} level="H" />
  </div>
);

export default QrCodeDisplay;