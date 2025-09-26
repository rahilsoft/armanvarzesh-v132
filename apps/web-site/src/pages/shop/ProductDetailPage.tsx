import React from "react";
const products = [
  { id: 1, name: "کمربند ورزشی", price: 390000, image: "/assets/images/belt.jpg", desc: "کمربند حرفه‌ای بدنسازی و فیتنس..." },
  { id: 2, name: "مکمل پروتئین", price: 1200000, image: "/assets/images/whey.jpg", desc: "پروتئین وی گلد استاندارد..." },
  { id: 3, name: "بند لیفت", price: 185000, image: "/assets/images/strap.jpg", desc: "بند لیفت مقاوم با دوام عالی..." },
];
const ProductDetailPage: React.FC<{ id?: string }> = ({ id }) => {
  const product = products.find(p => String(p.id) === String(id));
  if (!product) return <div className="p-6">محصول پیدا نشد.</div>;
  return (
    <div className="container mx-auto py-12 flex flex-col md:flex-row gap-8">
      <img src={product.image} alt={product.name} className="w-80 h-80 object-cover rounded" />
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="text-green-700 text-2xl mb-4">{product.price.toLocaleString()} تومان</div>
        <div className="mb-6">{product.desc}</div>
        <button className="btn-primary px-8 py-2 rounded">افزودن به سبد خرید</button>
      </div>
    </div>
  );
};
export default ProductDetailPage;
