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
            <PlanCard title="ویژه ورزشکاران" price="۲۹۰,۰۰۰" features={["پشتیبانی مستقیم", "تحلیل حرفه‌ای", "مربی برتر"]} />
            <PlanCard title="پایه" price="۱۲۰,۰۰۰" features={["برنامه استاندارد", "مشاوره اولیه"]} />
            <PlanCard title="VIP Club" price="۷۵۰,۰۰۰" features={["باشگاه VIP", "پاداش وفاداری", "دسترسی کامل"]} />
          </div>
        </section>

        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">مربیان برتر</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <CoachCard name="رضا قهرمان" field="بدنسازی" image="/assets/images/coach1.jpg" />
            <CoachCard name="سمیه اکبری" field="تناسب اندام" image="/assets/images/coach2.jpg" />
            <CoachCard name="ایمان رستگار" field="تغذیه و اصلاحی" image="/assets/images/coach3.jpg" />
          </div>
        </section>

        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">محصولات منتخب فروشگاه</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <ProductCard name="کمربند ورزشی" price={390_000} image="/assets/images/belt.jpg" />
            <ProductCard name="مکمل پروتئین" price={1_200_000} image="/assets/images/whey.jpg" />
            <ProductCard name="بند لیفت" price={185_000} image="/assets/images/strap.jpg" />
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