
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollVideo from './ScrollVideo';
import DeviceMock from './DeviceMock';
import { logEvent } from '../lib/analytics';

type Localized = { fa: string; en: string };

type Media = { kind: 'image' | 'video' | 'lottie' | 'scrollvideo'; src: string; alt?: Localized; blur?: string; srcset?: { url:string; format:'avif'|'webp'; width:number }[] };

type Tile = {
  id: string;
  type: 'showcase';
  title: Localized;
  subtitle: Localized;
  cta: { label: Localized; href: string };
  media: Media;
  animation?: { trigger: 'scroll' | 'hover' | 'click'; effect: 'fade-up' | 'zoom-in'; durationMs?: number };
  metricsKey?: string;
  variant?: string;
};

export const TileCard: React.FC<{ tile: Tile; locale?: 'fa' | 'en'; orderIndex?: number }>=({ tile, locale='fa', orderIndex })=>{
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if (!ref.current || tile?.animation?.trigger !== 'scroll') return;
    const el = ref.current;
    const observer = new IntersectionObserver(([entry])=>{
      if (entry.isIntersecting) { logEvent('tile_impression', { id: tile.id, metricsKey: tile.metricsKey, variant: tile.variant, order: orderIndex });
        el.classList.add('reveal');
      }
    }, { threshold: 0.2 });
    observer.observe(el);
    return ()=> observer.disconnect();
  }, [tile]);

  useEffect(()=>{
    if (tile.media.kind !== 'lottie' || typeof window === 'undefined') return;
    import('lottie-web').then(L=>{
      const container = ref.current?.querySelector('.lottie') as HTMLElement | null;
      if (!container) return;
      L.default.loadAnimation({ container, renderer:'svg', loop:true, autoplay:true, path: tile.media.src });
    }).catch(()=>{});
  }, [tile.media]);

  const t = (l: Localized)=> l?.[locale] ?? l?.fa ?? '';

  return (
    <div ref={ref} className="tile-card" data-effect={tile.animation?.effect || 'fade-up'}>

      <div className="media">
        {tile.media.kind === 'image' && (
          {tile.media.srcset?.length ? (
            <picture>
              {/* AVIF */}
              <source type="image/avif" srcSet={tile.media.srcset.filter(s=>s.format==='avif').sort((a,b)=>a.width-b.width).map(s=>`${s.url} ${s.width}w`).join(', ')} sizes="(max-width: 960px) 100vw, 60vw" />
              {/* WebP */}
              <source type="image/webp" srcSet={tile.media.srcset.filter(s=>s.format==='webp').sort((a,b)=>a.width-b.width).map(s=>`${s.url} ${s.width}w`).join(', ')} sizes="(max-width: 960px) 100vw, 60vw" />
              <img src={tile.media.src} alt={t(tile.media.alt || {fa:'', en:''})} loading={orderIndex===0?'eager':'lazy'} decoding="async" fetchPriority={orderIndex===0?'high':'auto'} style={{width:'100%', height:'auto', display:'block'}} />
            </picture>
          ) : (
            <Image src={tile.media.src} alt={t(tile.media.alt || {fa:'', en:''})} width={1280} height={720} sizes="(max-width: 960px) 100vw, 60vw" placeholder={tile.media.blur ? 'blur' : undefined} blurDataURL={tile.media.blur} priority={orderIndex===0} />
          )}
        )}
        {tile.media.kind === 'video' && (
          <video src={tile.media.src} controls playsInline preload="none" />
        )}
        {tile.media.kind === 'scrollvideo' && (<DeviceMock><ScrollVideo src={tile.media.src} /></DeviceMock>)}
        {tile.media.kind === 'lottie' && (
          <div className="lottie" data-src={tile.media.src}></div>
        )}
      </div>

      <div className="copy">
        <h3>{t(tile.title)}</h3>
        <p>{t(tile.subtitle)}</p>
        <Link href={tile.cta.href} className="cta" onClick={()=>logEvent("tile_click", { id: tile.id, href: tile.cta.href, metricsKey: tile.metricsKey, variant: tile.variant, order: orderIndex })}>{t(tile.cta.label)}</Link>
      </div>
      <style jsx>{`
        .tile-card{
          border-radius:16px; overflow:hidden; background:#0a0a0a;
          color:white; display:grid; grid-template-columns:1fr; gap:12px; padding:16px;
          opacity:0; transform: translateY(24px); transition: transform .6s var(--ease-smooth), opacity .6s var(--ease-smooth);
          box-shadow: var(--shadow-3);
        }
        .tile-card.reveal{ opacity:1; transform: translateY(0); }
        .media :global(img){ width:100%; height:auto; border-radius:12px; }
        .copy{ display:flex; flex-direction:column; gap:8px; }
        .cta{ padding:10px 16px; background:white; color:black; border-radius:10px; width:max-content; }
        @media(min-width: 960px){
          .tile-card{ grid-template-columns: 2fr 1fr; align-items:center; }
        }
      `}</style>
    </div>
  );
};
