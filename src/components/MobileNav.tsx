import { useEffect, useRef, useState } from 'react';
import type { Link } from '../content/home';

interface Props {
  links: Link[];
  cta: Link;
  contact: { email: string; phoneDisplay: string; phoneHref: string; whatsapp: string };
}

// Uses a native modal <dialog>: the browser handles the focus trap, Escape and inert background.
export default function MobileNav({ links, cta, contact }: Props) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
          <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span>Menu</span>
      </button>
      <dialog
        id="mobile-menu"
        ref={dialog}
        className="drawer"
        aria-label="Menu"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus(); // Safari does not focus a tapped button, so the dialog cannot restore it
        }}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <div className="drawer__inner">
          <button type="button" className="drawer__close" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>Close</span>
          </button>
          <nav aria-label="Main">
            <ul role="list" className="drawer__links">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn--primary drawer__cta" href={cta.href}>{cta.label}</a>
          <ul role="list" className="drawer__contact">
            <li><a className="link" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a className="link" href={contact.phoneHref}>{contact.phoneDisplay}</a></li>
            <li><a className="link" href={`mailto:${contact.email}`}>{contact.email}</a></li>
          </ul>
        </div>
      </dialog>
    </>
  );
}
