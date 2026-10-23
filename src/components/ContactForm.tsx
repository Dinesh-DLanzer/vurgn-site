import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import FormField from './FormField';
import { toContactInput, validateContact, type ContactErrors, type ContactInput } from '../lib/contact';
import './ContactForm.css';

interface Props {
  services: string[];
  submitLabel: string;
  successHeading: string;
  successBody: string;
  privacyHref: string;
  fallback: { email: string; whatsapp: string; phoneDisplay: string };
}

type Status = 'idle' | 'submitting' | 'success' | 'error';
const ORDER: (keyof ContactInput)[] = ['name', 'email', 'phone', 'service', 'goal', 'consent'];

export default function ContactForm({ services, submitLabel, successHeading, successBody, privacyHref, fallback }: Props) {
  const [values, setValues] = useState<ContactInput>({ name: '', email: '', phone: '', service: services[services.length - 1], goal: '', consent: false });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  const busy = status === 'submitting';

  useEffect(() => {
    if (status !== 'success') return;
    success.current?.focus({ preventScroll: true });
    success.current?.scrollIntoView({ block: 'center' });
  }, [status]);

  const check = (next: ContactInput) => validateContact(toContactInput({ ...next }), services);

  function set<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    // Re-check a field as it is corrected, but do not nag before the visitor has left it once.
    if (touched[key]) setErrors((e) => ({ ...e, [key]: check(next)[key] }));
  }
  const blur = (key: keyof ContactInput) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: check(values)[key] }));
  };

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const found = check(values);
    setErrors(found);
    setTouched(Object.fromEntries(ORDER.map((k) => [k, true])));
    const first = ORDER.find((k) => found[k]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) return setStatus('success');
      if (res.status === 422 && body.errors) {
        setErrors(body.errors);
        setStatus('idle');
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <svg viewBox="0 0 32 32" aria-hidden="true" width="40" height="40"><circle cx="16" cy="16" r="15" fill="currentColor" /><path d="m9.5 16.5 4.5 4.5 8.5-9" fill="none" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <h3 ref={success} tabIndex={-1} className="lead">{successHeading}</h3>
        <p>{successBody}</p>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={form} className="contact-form" method="post" action="/api/contact" noValidate onSubmit={submit} aria-busy={busy}>
      {errorCount > 0 && (
        <p className="form-alert" role="alert">
          {errorCount === 1 ? 'One field needs attention.' : `${errorCount} fields need attention.`}
        </p>
      )}
      <FormField kind="input" id="cf-name" name="name" type="text" label="Your name" autoComplete="name" maxLength={80}
        required readOnly={busy} value={values.name} error={errors.name} onChange={(v) => set('name', v)} onBlur={blur('name')} />
      <FormField kind="input" id="cf-email" name="email" type="email" inputMode="email" label="Email" autoComplete="email"
        required readOnly={busy} value={values.email} error={errors.email} onChange={(v) => set('email', v)} onBlur={blur('email')} />
      <FormField kind="input" id="cf-phone" name="phone" type="tel" inputMode="tel" label="WhatsApp or phone" autoComplete="tel"
        hint="With country code, so we can reply on WhatsApp." readOnly={busy} value={values.phone} error={errors.phone}
        onChange={(v) => set('phone', v)} onBlur={blur('phone')} />
      <FormField kind="select" id="cf-service" name="service" label="What do you need help with?" required options={services}
        readOnly={busy} value={values.service} error={errors.service} onChange={(v) => set('service', v)} onBlur={blur('service')} />
      <FormField kind="input" id="cf-goal" name="goal" type="text" label="Your goal, in one line" maxLength={200}
        hint="For example: more bookings from Google, or replying to WhatsApp enquiries faster." readOnly={busy}
        value={values.goal} error={errors.goal} onChange={(v) => set('goal', v)} onBlur={blur('goal')} />
      <FormField kind="checkbox" id="cf-consent" name="consent" required readOnly={busy} checked={values.consent} error={errors.consent}
        onChange={(v) => set('consent', v)} onBlur={blur('consent')}
        label={<>Vurgn may contact me about this request. I have read the <a className="link" href={privacyHref}>privacy policy</a>.</>} />

      {status === 'error' && (
        <div className="form-alert form-alert--block" role="alert">
          <p>We could not send your request just now. Please try again, or reach us directly:</p>
          <p>
            <a className="link" href={`mailto:${fallback.email}`}>{fallback.email}</a> or{' '}
            <a className="link" href={fallback.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp {fallback.phoneDisplay}<span className="sr-only"> (opens in a new tab)</span></a>
          </p>
        </div>
      )}

      <button type="submit" className="btn btn--ink contact-form__submit" aria-busy={busy} data-state={status === 'error' ? 'error' : undefined}>
        {busy ? 'Sending…' : status === 'error' ? 'Try again' : submitLabel}
      </button>
    </form>
  );
}
