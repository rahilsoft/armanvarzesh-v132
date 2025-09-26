import React, { useState } from "react";
const demoCart = [
  { id: 1, name: "کمربند ورزشی", price: 390000, image: "/assets/images/belt.jpg", qty: 1 },
  { id: 2, name: "مکمل پروتئین", price: 1200000, image: "/assets/images/whey.jpg", qty: 2 },
];
const CartPage: React.FC = () => {
  const [cart, setCart] = useState(demoCart);
  function removeItem(id: number) {
    setCart(cart.filter(p => p.id !== id));
  }
  function changeQty(id: number, qty: number) {
    setCart(cart.map(p => p.id === id ? { ...p, qty } : p));
  }
  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">سبد خرید شما</h1>
      {cart.length === 0 ? (
        <div>سبد خرید خالی است.</div>
      ) : (
        <>
          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th>محصول</th><th>تعداد</th><th>قیمت</th><th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(p => (
                <tr key={p.id} className="text-center border-b">
                  <td className="flex items-center gap-2 py-3">
                    <img src={p.image} alt={p.name} className="h-10 rounded" /> {p.name}
                  </td>
                  <td>
                    <input type="number" min="1" value={p.qty} onChange={e => changeQty(p.id, Number(e.target.value))} className="input w-16 text-center" />
                  </td>
                  <td>{(p.price * p.qty).toLocaleString()} تومان</td>
                  <td>
                    <button onClick={() => removeItem(p.id)} className="text-red-600">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xl font-bold mb-4">جمع کل: {total.toLocaleString()} تومان</div>
          <a href="/checkout" className="btn-primary px-8 py-2 rounded">ادامه به پرداخت</a>
        </>
      )}
    </div>
  );
};
export default CartPage;
