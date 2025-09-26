import React from 'react';
import { useWallet, useWalletHistory } from '../../../packages/data/wallet/hooks';
export default function Wallet(){
  const { data, loading } = useWallet();
  const { data: txns } = useWalletHistory();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>کیف پول (PWA)</h3>
      {loading? '...' : <div>Balance: {data?.balance} {data?.currency}</div>}
      <div style={{marginTop:8}}>{(txns||[]).map(t=> <div key={t.id}>{t.type} — {t.amount}</div>)}</div>
    </div>
  );
}
