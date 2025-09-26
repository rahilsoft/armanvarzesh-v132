import React from "react";
const Header: React.FC = () => (
  <header className="bg-white shadow sticky top-0 z-50">
    <div className="container mx-auto py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/assets/icons/logo.png" alt="لوگو" className="h-10" />
        <span className="text-xl font-bold">آرمان ورزش</span>
      </div>
      <nav className="flex gap-8 text-sm">
        <a href="/">خانه</a>
        <a href="/shop">فروشگاه</a>
        <a href="/coaches">مربیان</a>
        <a href="/services">خدمات</a>
        <a href="/vip">VIP</a>
        <a href="/auth" className="btn-primary px-3 py-1 rounded">ورود/ثبت‌نام</a>
      </nav>
    </div>
  </header>
);
export default Header;