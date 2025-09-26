import React from "react";
const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white py-8 mt-8">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <img src="/assets/icons/logo.png" alt="لوگو" className="h-8" />
        <span className="font-bold text-lg">آرمان ورزش</span>
      </div>
      <div className="flex gap-6">
        <a href="/about">درباره ما</a>
        <a href="/contact">تماس</a>
        <a href="/faq">سوالات متداول</a>
        <a href="/terms">قوانین</a>
      </div>
      <div className="flex gap-3">
        <a href="#"><img src="/assets/icons/instagram.png" alt="instagram" className="h-7" /></a>
        <a href="#"><img src="/assets/icons/telegram.png" alt="telegram" className="h-7" /></a>
      </div>
    </div>
    <div className="mt-6 text-center text-xs text-gray-400">© 2025 ArmanVarzesh.com</div>
  </footer>
);
export default Footer;