import React from "react";
const HeroSection: React.FC = () => (
  <section className="w-full h-[370px] md:h-[500px] bg-gradient-to-tr from-blue-600 to-blue-300 flex flex-col justify-center items-center text-white text-center relative overflow-hidden">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">آرمان ورزش<br />پلتفرم ورزش، تغذیه و سبک زندگی</h1>
    <p className="text-lg md:text-2xl mb-8">مربی خصوصی، برنامه اختصاصی، فروشگاه، باشگاه VIP و هرآنچه برای پیشرفتت نیاز داری!</p>
    <a href="/auth" className="btn-primary text-xl px-8 py-3 rounded">شروع کن</a>
    <div className="absolute bottom-0 left-0 w-full h-12 bg-white/10 blur-lg" />
  </section>
);
export default HeroSection;