import React from "react";

interface Props {
  tier: string;
  price: number;
  perks: string[];
}

const VipTierCard: React.FC<Props> = ({ tier, price, perks }) => (
  <div className="border rounded-lg shadow p-6 text-center hover:shadow-xl transition-all duration-300">
    <h2 className="text-2xl font-bold mb-4">{tier}</h2>
    <div className="text-green-600 text-xl mb-4">{price.toLocaleString()} تومان / ماهانه</div>
    <ul className="mb-6 text-sm text-left">
      {perks.map((perk, idx) => (
        <li key={idx} className="mb-2">✔️ {perk}</li>
      ))}
    </ul>
    <button className="btn-primary px-6 py-2 rounded">عضویت در پلن {tier}</button>
  </div>
);

export default VipTierCard;