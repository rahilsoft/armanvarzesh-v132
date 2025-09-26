import React from "react";
import ProductCard from "../../components/shop/ProductCard";

const products = [
  { id: 1, name: "کمربند ورزشی", price: 390000, image: "/assets/images/belt.jpg" },
  { id: 2, name: "مکمل پروتئین", price: 1200000, image: "/assets/images/whey.jpg" },
  { id: 3, name: "بند لیفت", price: 185000, image: "/assets/images/strap.jpg" },
];

const ShopPage: React.FC = () => (
  <div className="container mx-auto py-12">
    <h1 className="text-3xl font-bold text-center mb-8">فروشگاه آرمان ورزش</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export default ShopPage;