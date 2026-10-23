// Shared by the contact form island (client) and /api/contact (server), so both apply the same rules.

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  goal: string;
  consent: boolean;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Normalises untrusted input (form fields or JSON) into a ContactInput. */
export function toContactInput(raw: Record<string, unknown>): ContactInput {
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  return {
    name: text(raw.name),
    email: text(raw.email),
    phone: text(raw.phone),
    service: text(raw.service),
    goal: text(raw.goal),
    consent: raw.consent === true || raw.consent === 'on' || raw.consent === 'true',
  };
}

export function validateContact(input: ContactInput, allowedServices: readonly string[]): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.length < 2) errors.name = 'Enter your name.';
  else if (input.name.length > 80) errors.name = 'Keep your name under 80 characters.';

  if (!input.email) errors.email = 'Enter your email address.';
  else if (!EMAIL.test(input.email) || input.email.length > 254) errors.email = 'Enter an email address like name@example.com.';

  if (input.phone) {
    const digits = input.phone.replace(/\D/g, '');
    if (!/^\+?[\d\s()-]+$/.test(input.phone) || digits.length < 8 || digits.length > 15)
      errors.phone = 'Enter a phone or WhatsApp number with country code, like +91 98765 43210.';
  }

  if (!allowedServices.includes(input.service)) errors.service = 'Choose a service from the list.';
  if (input.goal.length > 200) errors.goal = 'Keep your goal under 200 characters.';
  if (!input.consent) errors.consent = 'Tick the box so we can contact you about this request.';
  return errors;
}
