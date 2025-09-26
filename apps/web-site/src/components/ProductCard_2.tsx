import React from "react";
const ProductCard: React.FC<{name:string, price:number, image:string}> = ({ name, price, image }) => (
  <div className="bg-white rounded shadow p-4 flex flex-col items-center w-[180px]">
    <img src={image} alt={name} className="h-24 mb-2 object-cover rounded" />
    <div className="font-bold text-base mb-1">{name}</div>
    <div className="text-green-700 mb-2">{price.toLocaleString()} تومان</div>
    <button className="btn-primary px-4 py-1 rounded">خرید</button>
  </div>
);
export default ProductCard;