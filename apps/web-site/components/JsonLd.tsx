
import React from 'react';

export default function JsonLd({ data }: { data: any }) {
  // Safely serialize JSON-LD by escaping characters that could break the script context.
  // See: https://nextjs.org/docs/messages/serialize-error for guidance.
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
