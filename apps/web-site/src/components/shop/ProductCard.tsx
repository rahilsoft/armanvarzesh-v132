import React from "react";

const ProductCard: React.FC<{ product: { name: string; price: number; image: string } }> = ({ product }) => (
  <div className="bg-white rounded shadow p-4 flex flex-col items-center hover:shadow-lg transition-all duration-200">
    <img src={product.image} alt={product.name} className="h-24 mb-2 object-cover rounded" />
    <div className="font-bold text-base mb-1">{product.name}</div>
    <div className="text-green-700 mb-2">{product.price.toLocaleString()} تومان</div>
    <button className="btn-primary px-4 py-1 rounded">افزودن به سبد خرید</button>
  </div>
);

export default ProductCard;