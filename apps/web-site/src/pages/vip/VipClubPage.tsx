import React from "react";
import VipBenefits from "../../components/vip/VipBenefits";
import VipTierCard from "../../components/vip/VipTierCard";

const VipClubPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">باشگاه VIP آرمان ورزش</h1>
      <p className="text-center mb-10 max-w-xl mx-auto text-lg">
        با عضویت در باشگاه VIP به امکانات ویژه‌ای همچون تخفیف، تمرینات اختصاصی، پشتیبانی ویژه و سطح دسترسی حرفه‌ای دست پیدا کنید.
      </p>
      <VipBenefits />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <VipTierCard tier="برنز" price={99000} perks={["۱۰٪ تخفیف", "پشتیبانی معمولی"]} />
        <VipTierCard tier="نقره‌ای" price={199000} perks={["۲۰٪ تخفیف", "تمرینات VIP", "پشتیبانی سریع"]} />
        <VipTierCard tier="طلایی" price={349000} perks={["۳۰٪ تخفیف", "دسترسی کامل", "پشتیبانی ۲۴/۷", "هدایای اختصاصی"]} />
      </div>
    </div>
  );
};

export default VipClubPage;