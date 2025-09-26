
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'fa' | 'en';
type I18nContextType = { locale: Locale; setLocale: (l: Locale)=>void; t: (obj: any)=>string };

const I18nContext = createContext<I18nContextType>({
  locale: 'fa',
  setLocale: ()=>{},
  t: (obj: any)=> (obj?.fa || obj?.en || '')
});

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({children})=>{
  const [locale, setLocale] = useState<Locale>('fa');
  useEffect(()=>{
    const url = new URL(window.location.href);
    const lang = (url.searchParams.get('lang') || document.cookie.match(/(?:^|; )lang=([^;]+)/)?.[1] || 'fa') as Locale;
    setLocale(lang === 'en' ? 'en':'fa');
  }, []);
  useEffect(()=>{
    document.cookie = `lang=${locale}; path=/; max-age=31536000`;
    document.dir = (locale === 'fa') ? 'rtl':'ltr';
  }, [locale]);
  const t = (obj:any)=> (obj?.[locale] || obj?.fa || obj?.en || '');
  return <I18nContext.Provider value={{locale, setLocale, t}}>{children}</I18nContext.Provider>
}

export const useI18n = ()=> useContext(I18nContext);
