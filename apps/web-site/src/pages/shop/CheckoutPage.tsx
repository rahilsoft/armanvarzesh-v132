import React, { useState } from "react";
const CheckoutPage: React.FC = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [done, setDone] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }
  if (done) return <div className="p-10 text-green-600 text-center text-2xl font-bold">سفارش شما با موفقیت ثبت شد!</div>;
  return (
    <div className="container mx-auto py-12 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">اطلاعات ارسال و پرداخت</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="input w-full" placeholder="نام و نام خانوادگی" value={name} onChange={e => setName(e.target.value)} required />
        <input className="input w-full" placeholder="موبایل" value={mobile} onChange={e => setMobile(e.target.value)} required />
        <textarea className="input w-full" placeholder="آدرس کامل" value={address} onChange={e => setAddress(e.target.value)} required />
        <button type="submit" className="btn-primary w-full py-2 text-lg">ثبت و پرداخت</button>
      </form>
    </div>
  );
};
export default CheckoutPage;
