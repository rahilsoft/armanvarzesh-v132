import dynamic from 'next/dynamic';
import React from 'react';
export function withNoSSR<T>(Comp: React.ComponentType<T>) {
  return dynamic(() => Promise.resolve(Comp as any), { ssr: false }) as React.ComponentType<T>;
}
export default withNoSSR;
