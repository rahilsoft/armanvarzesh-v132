import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeatureTile from "../components/FeatureTile";
import PlanCard from "../components/PlanCard";
import CoachCard from "../components/CoachCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <HeroSection />
        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">خدمات آرمان ورزش</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureTile icon="🏋️" title="مربیگری تخصصی" description="برنامه‌های اختصاصی برای هر سطح و هدف" />
            <FeatureTile icon="🍎" title="تغذیه حرفه‌ای" description="مشاوره رژیم و مکمل، طبق آخرین استانداردها" />
            <FeatureTile icon="🩺" title="حرکات اصلاحی" description="متخصص فیزیوتراپی و حرکت اصلاحی" />
          </div>
        </section>

        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">پلن‌ها و مزایای ویژه</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <PlanCard title="ویژه ورزشکاران" price="۲۹۰,۰۰۰" description="پلن حرفه‌ای برای ورزشکاران رقابتی" features={["پشتیبانی مستقیم", "تحلیل حرفه‌ای", "مربی برتر"]} onSelect={() => {}} />
            <PlanCard title="پایه" price="۱۲۰,۰۰۰" description="شروع مناسب برای تازه‌واردها" features={["برنامه استاندارد", "مشاوره اولیه"]} onSelect={() => {}} />
            <PlanCard title="VIP Club" price="۷۵۰,۰۰۰" description="تجربهٔ کامل و اختصاصی باشگاه VIP" features={["باشگاه VIP", "پاداش وفاداری", "دسترسی کامل"]} onSelect={() => {}} />
          </div>
        </section>

        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">مربیان برتر</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <CoachCard name="رضا قهرمان" specialty="بدنسازی" photo="/assets/images/coach1.jpg" onContact={() => {}} />
            <CoachCard name="سمیه اکبری" specialty="تناسب اندام" photo="/assets/images/coach2.jpg" onContact={() => {}} />
            <CoachCard name="ایمان رستگار" specialty="تغذیه و اصلاحی" photo="/assets/images/coach3.jpg" onContact={() => {}} />
          </div>
        </section>

        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">محصولات منتخب فروشگاه</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <ProductCard title="کمربند ورزشی" price="۳۹۰,۰۰۰" image="/assets/images/belt.jpg" onAddToCart={() => {}} />
            <ProductCard title="مکمل پروتئین" price="۱,۲۰۰,۰۰۰" image="/assets/images/whey.jpg" onAddToCart={() => {}} />
            <ProductCard title="بند لیفت" price="۱۸۵,۰۰۰" image="/assets/images/strap.jpg" onAddToCart={() => {}} />
          </div>
        </section>

        <section className="container mx-auto py-12 text-center">
          <a href="/auth" className="btn-primary text-xl px-8 py-3 rounded">همین حالا ثبت‌نام کن!</a>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;