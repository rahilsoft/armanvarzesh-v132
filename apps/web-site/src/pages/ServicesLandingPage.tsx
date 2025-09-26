import React from "react";
import Header from "../components/Header";
import FeatureTile from "../components/FeatureTile";
import Footer from "../components/Footer";

const SERVICES = [
  { icon: "🏋️‍♂️", title: "مربیگری خصوصی", desc: "برنامه تمرین حرفه‌ای و اختصاصی برای هر سطح و هدف" },
  { icon: "🍏", title: "تغذیه و مشاوره", desc: "تنظیم رژیم غذایی و مکمل با آخرین استانداردها" },
  { icon: "🦵", title: "حرکات اصلاحی و فیزیوتراپی", desc: "مشاوره تخصصی با فیزیوتراپیست و متخصص اصلاحی" },
  { icon: "🌟", title: "باشگاه VIP", desc: "امکانات ویژه، چت اختصاصی با مربی و پاداش وفاداری" },
  { icon: "💻", title: "برنامه آنلاین و حضوری", desc: "امکان انتخاب برنامه غیرحضوری یا حضوری با مربی منتخب" },
];

const ServicesLandingPage: React.FC = () => (
  <>
    <Header />
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">سرویس‌ها و خدمات آرمان ورزش</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {SERVICES.map((s) => (
          <FeatureTile key={s.title} icon={s.icon} title={s.title} description={s.desc} />
        ))}
      </div>
      <div className="text-center mt-10">
        <a href="/auth" className="btn-primary px-8 py-3 rounded text-xl">همین حالا ثبت‌نام کن و سرویس موردنظرت رو انتخاب کن!</a>
      </div>
    </main>
    <Footer />
  </>
);

export default ServicesLandingPage;