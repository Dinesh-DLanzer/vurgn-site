import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toContactInput, validateContact } from './contact.ts';

const services = ['AI Search and SEO', 'Not sure yet'];
const valid = { name: 'Asha Rao', email: 'asha@example.com', phone: '+91 98765 43210', service: 'Not sure yet', goal: 'More bookings', consent: 'on' };

test('accepts a complete request, from form fields or JSON', () => {
  assert.deepEqual(validateContact(toContactInput(valid), services), {});
  assert.deepEqual(validateContact(toContactInput({ ...valid, consent: true }), services), {});
});

test('phone and goal are optional', () => {
  assert.deepEqual(validateContact(toContactInput({ ...valid, phone: '', goal: '' }), services), {});
});

test('flags each invalid field', () => {
  const errors = validateContact(
    toContactInput({ name: ' ', email: 'asha@', phone: '12', service: 'Crypto', goal: 'x'.repeat(201) }),
    services,
  );
  assert.deepEqual(Object.keys(errors).sort(), ['consent', 'email', 'goal', 'name', 'phone', 'service']);
});

test('ignores non-string input instead of throwing', () => {
  const input = toContactInput({ name: 42, email: null, consent: 'yes' });
  assert.equal(input.name, '');
  assert.equal(input.consent, false);
});
