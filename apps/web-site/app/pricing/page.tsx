export const metadata = { title: 'پلن‌ها و قیمت‌ها' };
export default function Pricing() {
  const plans = [
    { name: 'پایه', price: 'Free', features: ['ثبت تمرین', 'پیگیری وزن', 'نمودار ساده'] },
    { name: 'حرفه‌ای', price: '299,000 تومان/ماه', features: ['برنامهٔ مربی', 'تغذیهٔ هوشمند', 'اعلان‌های هوشمند'] },
    { name: 'سازمانی', price: 'تماس بگیرید', features: ['پنل ادمین', 'پشتیبانی اولویت‌دار', 'گزارش‌های دوره‌ای'] },
  ];
  return (
    <main>
      <h1>پلن‌ها و قیمت‌ها</h1>
      <div className="grid">
        {plans.map((p,i)=>(
          <div className="card" key={i}>
            <h2>{p.name}</h2>
            <strong>{p.price}</strong>
            <ul>{p.features.map((f,j)=><li key={j}>{f}</li>)}</ul>
          </div>
        ))}
      </div>
      <style jsx>{`
        main{padding:48px 16px;max-width:1100px;margin:0 auto}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
        .card{border:1px solid #e5e7eb;border-radius:16px;padding:20px}
        h1{margin-bottom:16px}
        strong{display:block;margin:8px 0 12px}
      `}</style>
    </main>
  );
}
