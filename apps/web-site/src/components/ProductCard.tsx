import React from 'react';

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, price, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} />
      <h4>{title}</h4>
      <p>{price}</p>
      <button onClick={onAddToCart} className="btn-add">Add to Cart</button>
    </div>
  );
};

export default ProductCard;