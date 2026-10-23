import type { APIRoute } from 'astro';
import { CONTACT_WEBHOOK_URL } from 'astro:env/server';
import { serviceOptions } from '../../content/home';
import { toContactInput, validateContact } from '../../lib/contact';

// The only on-demand route; every page stays static HTML.
export const prerender = false;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  let raw: Record<string, unknown>;
  try {
    raw = request.headers.get('content-type')?.includes('application/json')
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  const input = toContactInput(raw ?? {});
  const errors = validateContact(input, serviceOptions);
  if (Object.keys(errors).length) return json({ ok: false, error: 'invalid', errors }, 422);

  // TODO(client): choose where enquiries go (CRM, email service or automation tool) and set CONTACT_WEBHOOK_URL.
  // Until it is set, the endpoint refuses rather than pretending, and the form shows the email and WhatsApp fallback.
  if (!CONTACT_WEBHOOK_URL) return json({ ok: false, error: 'not_configured' }, 503);

  try {
    const res = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...input, source: 'vurgn.com home', receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  } catch (err) {
    console.error('[contact] delivery failed', err);
    return json({ ok: false, error: 'delivery_failed' }, 502);
  }
  return json({ ok: true }, 200);
};
