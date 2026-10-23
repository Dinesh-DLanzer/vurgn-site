/**
 * Home page copy. DRAFT: every string here is for client review and not yet approved.
 *
 * Shaped like the Sanity singleton in sanity/schemas/homePage.ts (same field names), so moving to
 * Sanity means swapping this import for a GROQ query that returns the same object.
 * Rules for editors: no statistics, client counts, ratings or testimonials until they are real and consented.
 */
import type { ImageMetadata } from 'astro';
import auditImage from '../assets/samples/ai-visibility-audit.png';
import roadmapImage from '../assets/samples/90-day-roadmap.png';
import dashboardImage from '../assets/samples/monthly-dashboard.png';

export interface Link { label: string; href: string }
export interface Service { _key: string; title: string; outcome: string; href: string }
export interface Differentiator { _key: string; title: string; body: string }
export interface Step { _key: string; title: string; body: string }
export interface Faq { _key: string; question: string; answer: string }
export interface ProofItem {
  _key: string;
  title: string;
  category: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  /** true while the item is a sample deliverable with made-up data; false for a real, consented case study */
  isExample: boolean;
  link?: Link;
}

export interface HomePage {
  _type: 'homePage';
  copyStatus: 'draft' | 'approved';
  seo: { title: string; description: string; ogImageAlt: string };
  hero: { heading: string; subheading: string; primaryCta: Link; secondaryCta: Link; visualLabel: string };
  servicesSection: { heading: string; audienceHeading: string; audience: string[]; audienceLink: Link; helpText: string; helpLink: Link };
  services: Service[];
  whySection: { heading: string; lead: string; cta: Link };
  differentiators: Differentiator[];
  processSection: { heading: string; intro: string };
  steps: Step[];
  proofSection: { heading: string; intro: string };
  proof: ProofItem[];
  diagnostic: { heading: string; body: string; word: string; href: string; linkLabel: string };
  faqSection: { heading: string };
  faqs: Faq[];
  contactSection: { heading: string; body: string; submitLabel: string; successHeading: string; successBody: string };
}

export const contact = {
  email: 'Contact@vurgn.com',
  phoneDisplay: '+91 84484 56819',
  phoneHref: 'tel:+918448456819',
  whatsapp: 'https://wa.me/918448456819',
  instagram: 'https://www.instagram.com/vurgnsocial',
  instagramHandle: '@vurgnsocial',
};

/** Site-wide navigation. `menu` names the mega-menu panel a top-level item opens on hover. */
export interface NavItem extends Link { menu?: 'services' | 'industries' }

export const nav: NavItem[] = [
  { label: 'Services', href: '/services', menu: 'services' },
  { label: 'Industries', href: '/industries', menu: 'industries' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export const consultation: Link = { label: 'Book a free consultation', href: '/contact' };

/** The sectors the current site already names. Lines are DRAFT: what we would do for each, not results. */
export const industries: (Link & { line: string })[] = [
  { label: 'Clinics and healthcare', href: '/industries/healthcare', line: 'Appointment bots, local search and review follow-ups.' },
  { label: 'Real estate', href: '/industries/real-estate', line: 'Lead capture on WhatsApp and instant replies to property enquiries.' },
  { label: 'Online stores', href: '/industries/ecommerce', line: 'Product search visibility, order updates and abandoned-cart follow-ups.' },
  { label: 'Restaurants', href: '/industries/restaurants', line: 'Table bookings, menu questions and Google Business Profile upkeep.' },
  { label: 'Law firms', href: '/industries/law-firms', line: 'Enquiry intake, consultation booking and local search for each practice area.' },
];

export const home: HomePage = {
  _type: 'homePage',
  copyStatus: 'draft',
  seo: {
    title: 'AI Search & Automation for Growing Businesses | Vurgn',
    description:
      'Vurgn helps growing businesses get found in Google and AI answers, and automates enquiries, follow-ups and bookings. Book a free consultation.',
    ogImageAlt: 'Vurgn: AI search and automation for growing businesses',
  },
  hero: {
    heading: 'AI search & automation for growing businesses',
    subheading:
      'We help you show up when customers ask Google, ChatGPT or Gemini, then put AI to work on the replies, follow-ups and bookings that fill your day.',
    primaryCta: consultation,
    secondaryCta: { label: 'See our services', href: '#services' },
    visualLabel:
      'Illustration: a customer asks an AI assistant for a recommendation and the answer ends with your business, beside a local search and an enquiry that moves from reply to booking.',
  },
  servicesSection: {
    heading: 'What we do.',
    audienceHeading: 'Who we work with',
    audience: industries.map((i) => i.label),
    audienceLink: { label: 'Industries we serve', href: '/industries' },
    helpText: 'Not sure where to start? Most clients begin with one service and add the next once it works.',
    helpLink: consultation,
  },
  services: [
    {
      _key: 'ai-search-seo',
      title: 'AI Search and SEO',
      outcome: 'Rank on Google and get named in AI answers when customers ask about what you sell.',
      href: '/services/ai-search-seo',
    },
    {
      _key: 'ai-chatbots-voice-agents',
      title: 'AI Chatbots and Voice Agents',
      outcome: 'Answer every enquiry on your website, WhatsApp and phone, and pass the real leads to your team.',
      href: '/services/ai-chatbots-voice-agents',
    },
    {
      _key: 'business-automation',
      title: 'Business Automation',
      outcome: 'Connect your forms, CRM, sheets and inbox so follow-ups, reminders and reports run on their own.',
      href: '/services/business-automation',
    },
    {
      _key: 'websites-paid-media',
      title: 'Websites and Paid Media',
      outcome: 'Fast websites and Google and Meta campaigns built to turn visits into enquiries you can track.',
      href: '/services/websites-paid-media',
    },
  ],
  whySection: {
    heading: 'Why Vurgn.',
    lead: 'Customers who find you still need an answer, a follow-up and a booking, so we plan the whole path, not one channel.',
    cta: consultation,
  },
  differentiators: [
    {
      _key: 'one-plan',
      title: 'Search, AI and automation in one plan.',
      body: 'We look at how people find you and what happens after they enquire, so SEO, chatbots and workflows are built to work together rather than sold as separate packages.',
    },
    {
      _key: 'start-small',
      title: 'One goal, a clear scope and a baseline.',
      body: 'We start with the problem that costs you the most, agree how we will measure it before work begins, and expand only once it is working.',
    },
    {
      _key: 'plain-reporting',
      title: 'A plain-language report every month.',
      body: 'What we did, what changed, what we will do next. No jargon and no vanity numbers.',
    },
    {
      _key: 'you-own-it',
      title: 'Everything set up in your name.',
      body: 'Your website, ad accounts, data and automations belong to you, and stay with you if you ever leave us.',
    },
  ],
  processSection: {
    heading: 'How we work.',
    intro: 'Four stages, the same for a chatbot or a full search programme. You always know which one we are in and what comes next.',
  },
  steps: [
    {
      _key: 'discover',
      title: 'Discover',
      body: 'We learn your business, customers and goals, and check how you show up in Google and AI answers today. You get a short written audit.',
    },
    {
      _key: 'plan',
      title: 'Plan',
      body: 'We agree one goal, the scope, a timeline and a quote, and record the baseline we will measure against.',
    },
    {
      _key: 'build',
      title: 'Build',
      body: 'We set up the pages, campaigns, chatbots or automations, test them with your team, and launch.',
    },
    {
      _key: 'improve',
      title: 'Improve',
      body: 'Each month we review the numbers with you, fix what is not working and decide the next step together.',
    },
  ],
  proofSection: {
    heading: 'What you get.',
    intro:
      'Client case studies will appear here once they are approved for publishing. Until then, these are the documents you receive from us, shown with made-up example data.',
  },
  proof: [
    {
      _key: 'audit',
      title: 'AI visibility audit',
      category: 'From Discover',
      description:
        'How Google, ChatGPT and Gemini describe your business today, where competitors appear instead of you, and the fixes that matter most, in order.',
      image: auditImage,
      imageAlt: 'Example AI visibility audit report with made-up data: a summary score, the questions tested and a ranked list of fixes.',
      isExample: true,
    },
    {
      _key: 'roadmap',
      title: '90-day roadmap',
      category: 'From Plan',
      description:
        'One page with the goal, the work for each month, who does what, and the numbers we will report on, so everyone signs off on the same plan.',
      image: roadmapImage,
      imageAlt: 'Example 90-day roadmap with made-up data: a goal, three monthly columns of tasks and the measures to report.',
      isExample: true,
    },
    {
      _key: 'dashboard',
      title: 'Monthly results dashboard',
      category: 'From Improve',
      description:
        'Enquiries, calls, bookings and search visibility in one place, with a short note each month on what changed and why.',
      image: dashboardImage,
      imageAlt: 'Example monthly dashboard with made-up data: enquiries by channel, bookings and a plain-language monthly note.',
      isExample: true,
    },
  ],
  diagnostic: {
    heading: 'Free AI visibility check',
    body: 'Tell us your business and city. We ask Google, ChatGPT and Gemini what your customers would ask, and send you what they say about you and your competitors.',
    word: 'Check',
    href: '/contact?topic=ai-visibility',
    linkLabel: 'Request a free AI visibility check',
  },
  faqSection: { heading: 'Questions.' },
  faqs: [
    {
      _key: 'services',
      question: 'What services does Vurgn offer?',
      answer:
        'Four that work best together: AI search and SEO, AI chatbots and voice agents, business automation, and websites with paid media on Google and Meta. Most clients start with one and add the next once the first is working.',
    },
    {
      _key: 'who',
      question: 'Who can benefit?',
      answer:
        'Growing businesses that win customers through search and enquiries: clinics, property firms, online stores, restaurants, law firms and other service businesses. If you lose leads to slow replies, or rarely appear when people search for what you do, we can likely help.',
    },
    {
      _key: 'ai',
      question: 'How does AI improve my business?',
      answer:
        'In two practical ways. It helps customers find you, as more people ask ChatGPT, Gemini or Google’s AI answers for recommendations. And it takes repetitive work off your team: answering common questions, qualifying leads, sending reminders and updating records. We start with the task that costs you the most time or the most leads.',
    },
    {
      _key: 'seo',
      question: 'Can you help with SEO?',
      answer:
        'Yes. SEO is the base of our AI search work: technical fixes, local SEO and your Google Business Profile, content that answers real customer questions, and structured data that helps search engines and AI tools understand your business. We report rankings, traffic and enquiries every month.',
    },
    {
      _key: 'websites',
      question: 'Do you offer custom website design?',
      answer:
        'Yes. We design and build each site around what you sell and who buys it, so it loads fast, works well on phones and is easy for your team to update. It is connected to your forms, WhatsApp and analytics, and set up in your name.',
    },
    {
      _key: 'start',
      question: 'How do I get started?',
      answer:
        'Book a free consultation with the form below, or message us on WhatsApp. We ask about your business and goals, look at how you show up online today, and suggest a first step with a clear quote. There is no obligation to go ahead.',
    },
  ],
  contactSection: {
    heading: 'Book a free consultation.',
    body: 'Tell us a little about your business and what you want to change. We reply by email or WhatsApp to set a time.',
    submitLabel: 'Book a free consultation',
    successHeading: 'Thanks, we have your request.',
    successBody: 'We will reply by email or WhatsApp to set a time. If it is urgent, message us on WhatsApp.',
  },
};

/** Service interest options for the contact form: the four services plus a neutral choice. */
export const serviceOptions = [...home.services.map((s) => s.title), 'Not sure yet'];
