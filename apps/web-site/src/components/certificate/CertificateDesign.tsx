import React from "react";
import QRGenerator from "./QRGenerator";

const CertificateDesign: React.FC = () => {
  return (
    <div className="w-full max-w-2xl bg-white border-4 border-blue-800 p-6 rounded shadow-lg relative text-center font-sans">
      <h1 className="text-2xl font-bold text-blue-800 mb-2">گواهی‌نامه رسمی مربی‌گری</h1>
      <p className="text-sm text-gray-600 mb-6">این گواهی‌نامه برای اثبات توانمندی و سطح تخصصی مربی صادر شده است</p>

      <div className="text-right pr-4 mb-4">
        <p>👤 نام مربی: <strong>سپیده نادری</strong></p>
        <p>🆔 کد گواهی: <strong>ARM-FIT-TR-0009283</strong></p>
        <p>📅 تاریخ صدور: ۱۴۰۳/۰۴/۲۹</p>
        <p>⏳ اعتبار: ۱ سال</p>
        <p>📎 لینک عمومی: armanfit.ir/certificate/sepideh-naderi/9283</p>
      </div>

      <div className="mt-8">
        <img src="/seal.png" alt="مهر رسمی" className="w-24 inline-block" />
        <img src="/signature.png" alt="امضا" className="w-24 inline-block ml-8" />
      </div>

      <div className="absolute bottom-4 left-4">
        <QRGenerator link="https://armanfit.ir/certificate/sepideh-naderi/9283" />
      </div>
    </div>
  );
};

export default CertificateDesign;