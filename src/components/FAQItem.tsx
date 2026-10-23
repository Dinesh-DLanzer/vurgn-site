import type { Faq } from '../content/home';

interface Props {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

// One question: a heading-wrapped button that controls its answer region (WAI-ARIA accordion pattern).
export default function FAQItem({ faq, open, onToggle, disabled = false }: Props) {
  const q = `faq-${faq._key}-q`;
  const a = `faq-${faq._key}-a`;
  return (
    <li className="faq-item" data-open={open} data-reveal="">
      <h3 className="faq-item__heading">
        <button
          type="button"
          id={q}
          className="faq-item__button"
          aria-expanded={open}
          aria-controls={a}
          disabled={disabled}
          onClick={onToggle}
        >
          <span>{faq.question}</span>
          <span className="faq-item__icon" aria-hidden="true" />
        </button>
      </h3>
      <div id={a} role="region" aria-labelledby={q} className="faq-item__answer" hidden={!open}>
        <p>{faq.answer}</p>
      </div>
    </li>
  );
}
