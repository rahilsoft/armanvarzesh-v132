
import React from 'react';
import { TileCard } from './TileCard';

type Localized = { fa: string; en: string };
type Tile = {
  id: string;
  type: 'showcase';
  title: Localized;
  subtitle: Localized;
  cta: { label: Localized; href: string };
  media: { kind: 'image' | 'video' | 'lottie'; src: string; alt?: Localized };
  animation?: { trigger: 'scroll' | 'hover' | 'click'; effect: 'fade-up' | 'zoom-in'; durationMs?: number };
  metricsKey?: string;
};

export const ShowcaseGrid: React.FC<{ tiles: Tile[]; locale?: 'fa' | 'en' }>=({ tiles, locale='fa' })=>{
  return (
    <div className="grid">
      {tiles.map((t,idx) => <TileCard key={t.id || idx} tile={t} locale={locale} orderIndex={idx} />)}
      <style jsx>{`
        .grid{ display:grid; gap:24px; grid-template-columns:1fr; }
        @media(min-width: 960px){
          .grid{ grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
};
