
'use client';
import React from 'react';
import { useFlag } from '../lib/flags';

export function Gate({ flag, children, fallback=null }:{ flag:string; children: React.ReactNode; fallback?: React.ReactNode }){
  const on = useFlag(flag, true);
  return on ? <>{children}</> : <>{fallback}</>;
}
