import React, { useState } from "react";

const PayoutRequest: React.FC = () => {
  const [amount, setAmount] = useState("");

  return (
    <div className="bg-green-50 p-4 rounded mb-6">
      <h2 className="text-sm font-bold mb-2">درخواست تسویه</h2>
      <input
        type="text"
        placeholder="مبلغ مورد نظر (تومان)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border p-2 rounded text-sm mb-2"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 w-full">
        ثبت درخواست واریز
      </button>
    </div>
  );
};

export default PayoutRequest;