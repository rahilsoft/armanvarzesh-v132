import React from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../../../packages/auth/context';
import { Guard } from '../../../packages/security/guards/react';

import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { usePayroll } from '../../../packages/data/payroll/hooks';

export default function PayrollPageGuardedWrapper(){
  return (<AuthProvider><PayrollPageInner/></AuthProvider>);
}

function PayrollPageInner(){
  const { role } = useAuth();
function PayrollPage(){
  const { data, loading, error } = usePayroll();
  return (
    <div dir="rtl">
      <Guard role={role} feature="payroll" action="view" fallback={<p>دسترسی غیرمجاز</p>}>
      <Head><title>حقوق مربیان — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>حقوق مربیان</h1>
      <Card>
        {loading? '...' : error? 'خطا' : !data? 'چیزی نیست' :
          <div>
            <div>جمع: {data.total} {data.currency}</div>
            <table><thead><tr><th>دوره</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
            <tbody>{data.items.map(i=> <tr key={i.id}><td>{i.period}</td><td>{i.amount}</td><td>{i.status}</td></tr>)}</tbody></table>
          </div>
        }
      </Card>
    </Guard>
    </div>
  );
}

