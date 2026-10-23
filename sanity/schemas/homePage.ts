/**
 * Sanity schema for the Home page singleton. NOT wired up yet.
 * Field names match src/content/home.ts so components need no changes when the page reads from Sanity.
 * Written as plain objects (no `sanity` import) so it does not add a dependency to the site; wrap each in
 * defineType/defineField from 'sanity' when it moves into the Studio project.
 * Images (proof[].image) become Sanity image fields; map them to Astro images (or @sanity/image-url) in the query layer.
 */

const link = (name: string, title: string) => ({
  name,
  title,
  type: 'object',
  fields: [
    { name: 'label', type: 'string', validation: (r: any) => r.required() },
    { name: 'href', type: 'string', description: 'Root-relative path (/contact) or full URL', validation: (r: any) => r.required() },
  ],
});

const keyedList = (name: string, title: string, fields: object[], rule?: (r: any) => any) => ({
  name,
  title,
  type: 'array',
  of: [{ type: 'object', fields }],
  validation: rule,
});

export const homePage = {
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  // Singleton: restrict to one document via the Studio structure (documentId 'homePage').
  fields: [
    {
      name: 'copyStatus',
      title: 'Copy status',
      type: 'string',
      options: { list: ['draft', 'approved'], layout: 'radio' },
      initialValue: 'draft',
    },
    {
      name: 'seo',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', validation: (r: any) => r.required().max(60) },
        { name: 'description', type: 'text', rows: 3, validation: (r: any) => r.required().max(155) },
        { name: 'ogImageAlt', type: 'string' },
      ],
    },
    {
      name: 'hero',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', description: 'Who we help and the outcome. Keep under 48 characters so it fits two lines on phones.', validation: (r: any) => r.required().max(48) },
        { name: 'subheading', type: 'text', rows: 3 },
        link('primaryCta', 'Primary button'),
        link('secondaryCta', 'Secondary button'),
        { name: 'visualLabel', type: 'string', title: 'Description of the hero illustration (alt text)' },
      ],
    },
    {
      name: 'servicesSection',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string' },
        { name: 'audienceHeading', type: 'string' },
        { name: 'audience', type: 'array', of: [{ type: 'string' }] },
        link('audienceLink', 'Audience link'),
        { name: 'helpText', type: 'string' },
        link('helpLink', 'Help link'),
      ],
    },
    keyedList('services', 'Services', [
      { name: 'title', type: 'string', validation: (r: any) => r.required() },
      { name: 'outcome', type: 'string', description: 'One line on the outcome', validation: (r: any) => r.required().max(120) },
      { name: 'href', type: 'string', description: 'Service page path, e.g. /services/ai-search-seo' },
    ], (r) => r.length(4)),
    {
      name: 'whySection',
      type: 'object',
      fields: [{ name: 'heading', type: 'string' }, { name: 'lead', type: 'text', rows: 2 }, link('cta', 'Closing link')],
    },
    keyedList('differentiators', 'Differentiators', [
      { name: 'title', type: 'string', description: 'A claim that needs no evidence: how we work, not results', validation: (r: any) => r.required() },
      { name: 'body', type: 'text', rows: 2 },
    ], (r) => r.min(3).max(4)),
    { name: 'processSection', type: 'object', fields: [{ name: 'heading', type: 'string' }, { name: 'intro', type: 'text', rows: 2 }] },
    keyedList('steps', 'Process steps', [
      { name: 'title', type: 'string', validation: (r: any) => r.required() },
      { name: 'body', type: 'text', rows: 2 },
    ], (r) => r.length(4)),
    { name: 'proofSection', type: 'object', fields: [{ name: 'heading', type: 'string' }, { name: 'intro', type: 'text', rows: 3 }] },
    keyedList('proof', 'Proof (sample deliverables now, case studies later)', [
      { name: 'title', type: 'string', validation: (r: any) => r.required() },
      { name: 'category', type: 'string' },
      { name: 'description', type: 'text', rows: 3 },
      { name: 'image', type: 'image', validation: (r: any) => r.required() },
      { name: 'imageAlt', type: 'string', validation: (r: any) => r.required() },
      { name: 'isExample', type: 'boolean', description: 'On for sample deliverables with made-up data. Off only for real, consented client results.', initialValue: true },
      link('link', 'Case study link (optional)'),
    ]),
    {
      name: 'diagnostic',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string' },
        { name: 'body', type: 'text', rows: 2 },
        { name: 'word', type: 'string', description: 'One short verb, set huge', validation: (r: any) => r.max(8) },
        { name: 'href', type: 'string' },
        { name: 'linkLabel', type: 'string', description: 'Accessible name; must contain the word above' },
      ],
    },
    { name: 'faqSection', type: 'object', fields: [{ name: 'heading', type: 'string' }] },
    keyedList('faqs', 'FAQs', [
      { name: 'question', type: 'string', validation: (r: any) => r.required() },
      { name: 'answer', type: 'text', rows: 4, validation: (r: any) => r.required() },
    ]),
    {
      name: 'contactSection',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string' },
        { name: 'body', type: 'text', rows: 2 },
        { name: 'submitLabel', type: 'string' },
        { name: 'successHeading', type: 'string' },
        { name: 'successBody', type: 'text', rows: 2 },
      ],
    },
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
};

export default homePage;
