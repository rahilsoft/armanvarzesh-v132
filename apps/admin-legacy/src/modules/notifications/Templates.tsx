import React, { useState } from 'react';
export default function Templates(){
  const [tpl,setTpl] = useState('welcome');
  return (
    <div dir="rtl">
      <h2>قالب‌های ایمیل/SMS</h2>
      <select value={tpl} onChange={e=> setTpl(e.target.value)}>
        <option value="welcome">welcome.html</option>
        <option value="receipt">receipt.html</option>
        <option value="otp">otp.txt</option>
        <option value="promo">promo.txt</option>
      </select>
      <p>مسیرها: packages/templates/email/* و packages/templates/sms/*</p>
      <p>ویرایش واقعی را به BFF متصل کنید.</p>
    </div>
  );
}
