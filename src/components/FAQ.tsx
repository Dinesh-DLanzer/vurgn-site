import { useEffect, useState } from 'react';
import type { Faq } from '../content/home';
import FAQItem from './FAQItem';
import './FAQ.css';

// One answer open at a time. data-ready marks hydration so the pre-hydration (loading) state can be styled.
export default function FAQ({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <ul role="list" className="faq" data-ready={ready}>
      {items.map((faq) => (
        <FAQItem
          key={faq._key}
          faq={faq}
          open={open === faq._key}
          onToggle={() => setOpen((current) => (current === faq._key ? null : faq._key))}
        />
      ))}
    </ul>
  );
}
