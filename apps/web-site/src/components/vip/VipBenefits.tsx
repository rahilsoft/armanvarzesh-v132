import React from "react";

const VipBenefits: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-bold mb-2">تخفیف‌های ویژه</h3>
      <p>اعضا VIP از تخفیف‌های دائمی در دوره‌ها، محصولات و خدمات بهره‌مند می‌شوند.</p>
    </div>
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-bold mb-2">تمرینات اختصاصی</h3>
      <p>مجموعه تمرینات و برنامه‌های پیشرفته فقط برای اعضای VIP قابل دسترسی است.</p>
    </div>
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-bold mb-2">پشتیبانی سریع و حرفه‌ای</h3>
      <p>اعضای طلایی از پشتیبانی لحظه‌ای با اولویت بالا برخوردار هستند.</p>
    </div>
  </div>
);

export default VipBenefits;