import React from 'react';

interface PlanCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, price, description, features, onSelect }) => {
  return (
    <div className="plan-card">
      <h3>{title}</h3>
      <p className="price">{price}</p>
      <p>{description}</p>
      <ul>
        {features.map((feature, idx) => <li key={idx}>{feature}</li>)}
      </ul>
      <button onClick={onSelect} className="btn-select">Select Plan</button>
    </div>
  );
};

export default PlanCard;