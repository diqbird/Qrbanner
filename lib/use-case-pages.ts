export interface UseCasePage {
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  keywords: string[];
  description: string;
  benefits: string[];
  steps: string[];
  categoryId: string;
  relatedSolutionSlug?: string;
  icon: string;
}

export const USE_CASE_PAGES: UseCasePage[] = [
  {
    slug: 'product-packaging',
    title: 'QR Codes on Product Packaging',
    headline: 'Turn every package into a digital touchpoint',
    metaDescription:
      'Add QR codes to product packaging for manuals, warranty registration, reorder links and scan analytics. Free dynamic QR generator.',
    keywords: ['product packaging QR code', 'box QR code', 'packaging QR marketing'],
    description:
      'Place a QR code on boxes, labels or inserts to share setup guides, warranty forms, recipes or reorder pages — and update the link without reprinting.',
    benefits: [
      'Link to manuals, videos or support without extra print cost',
      'Track scans by region and campaign batch',
      'Swap destinations for seasonal promos or recalls',
      'Custom branding with logo and brand colors',
    ],
    steps: [
      'Create a dynamic website or PDF QR code',
      'Add your logo and frame style',
      'Export print-ready PNG or SVG for packaging art',
      'Monitor scans in the dashboard after launch',
    ],
    categoryId: 'url',
    relatedSolutionSlug: 'retail-stores',
    icon: 'package',
  },
  {
    slug: 'trade-show-leads',
    title: 'Trade Show & Expo Lead Capture',
    headline: 'Capture booth visitors without paper forms',
    metaDescription:
      'Use QR codes at trade shows for lead capture, brochure downloads and follow-up links. Track booth traffic with scan analytics.',
    keywords: ['trade show QR code', 'expo lead capture QR', 'booth QR code'],
    description:
      'Replace clipboards with a scannable landing page or vCard. Route visitors to demos, calendars or CRM forms and measure peak booth hours.',
    benefits: [
      'Instant contact save with vCard QR codes',
      'A/B test two landing pages from one booth',
      'Geofence routing for multi-city tours',
      'Webhook leads to HubSpot or Zapier',
    ],
    steps: [
      'Pick a business card or link hub template',
      'Add demo booking or lead form URL',
      'Print on banners, badges and handouts',
      'Review scan heatmaps after the event',
    ],
    categoryId: 'vcard',
    relatedSolutionSlug: 'trade-shows-expos',
    icon: 'presentation',
  },
  {
    slug: 'print-advertising',
    title: 'Print Ads, Posters & Flyers',
    headline: 'Bridge offline print to online conversions',
    metaDescription:
      'Add QR codes to posters, flyers and magazine ads. Track which placements drive scans and update offers without reprinting.',
    keywords: ['poster QR code', 'flyer QR code', 'print advertising QR'],
    description:
      'Connect print campaigns to landing pages, promo codes or video content. Dynamic codes let you fix typos and refresh creatives mid-flight.',
    benefits: [
      'UTM-friendly landing pages per placement',
      'Password-protected previews for clients',
      'Schedule redirects for campaign start/end dates',
      'Export print banners with bleed guides',
    ],
    steps: [
      'Create a URL QR with your campaign landing page',
      'Design a high-contrast code for print size',
      'Use unique codes per city or publication',
      'Compare scan rates in analytics',
    ],
    categoryId: 'url',
    icon: 'newspaper',
  },
  {
    slug: 'email-signature',
    title: 'Email Signature QR Codes',
    headline: 'Share contact details from every email',
    metaDescription:
      'Add a QR code to email signatures for vCard saves, booking links or social profiles. Update once — signatures stay current.',
    keywords: ['email signature QR code', 'vCard email QR', 'professional email QR'],
    description:
      'Embed a small QR in your signature block so mobile readers can save your contact or book a meeting in one scan.',
    benefits: [
      'vCard saves name, phone and email automatically',
      'Update job title or phone without new signatures',
      'Track how often your signature drives scans',
      'Works in Gmail, Outlook and Apple Mail',
    ],
    steps: [
      'Build a vCard QR with your latest details',
      'Download a compact PNG for signature use',
      'Link to calendar or portfolio as secondary CTA',
      'Refresh the code when you change roles',
    ],
    categoryId: 'vcard',
    relatedSolutionSlug: 'business-card',
    icon: 'mail',
  },
  {
    slug: 'restaurant-table-tents',
    title: 'Restaurant Table Tent QR Codes',
    headline: 'Menus, reviews and Wi‑Fi on every table',
    metaDescription:
      'Create table tent QR codes for digital menus, Google reviews and guest Wi‑Fi. Update menu links without reprinting tents.',
    keywords: ['table tent QR code', 'restaurant table QR', 'menu tent QR'],
    description:
      'Guests scan for menus, specials, feedback or Wi‑Fi credentials. Dynamic menus mean price changes do not require new print runs.',
    benefits: [
      'Menu PDF or web URL with one code per room',
      'Lunch/dinner routing to different menus',
      'Optional password for staff-only menus',
      'Print-ready tent layouts with branding',
    ],
    steps: [
      'Use the restaurant menu template',
      'Paste your menu URL or upload PDF link',
      'Add logo and brand colors to the QR frame',
      'Print tents and monitor opens by hour',
    ],
    categoryId: 'menu',
    relatedSolutionSlug: 'restaurant-menu',
    icon: 'utensils',
  },
  {
    slug: 'hotel-guest-experience',
    title: 'Hotel Guest Experience QR',
    headline: 'Wi‑Fi, guides and upsells in every room',
    metaDescription:
      'Hotel room QR codes for Wi‑Fi, local guides, spa booking and concierge chat. Hospitality-ready templates with analytics.',
    keywords: ['hotel room QR code', 'hospitality QR', 'guest WiFi QR hotel'],
    description:
      'Replace laminated cards with a single scannable hub for Wi‑Fi, room service, checkout info and local recommendations.',
    benefits: [
      'Wi‑Fi QR joins network without typing passwords',
      'Link hub for spa, dining and transport partners',
      'Multilingual landing pages for international guests',
      'Scan analytics by floor or property',
    ],
    steps: [
      'Create Wi‑Fi and link hub codes per property',
      'Add branding matching your property guidelines',
      'Place on key folders, mirrors and elevators',
      'Route seasonal offers via scheduled redirects',
    ],
    categoryId: 'wifi',
    relatedSolutionSlug: 'hotels-hospitality',
    icon: 'bed',
  },
  {
    slug: 'event-check-in',
    title: 'Event Check-In & Badges',
    headline: 'Faster registration and session links',
    metaDescription:
      'Event QR codes for check-in, agendas, session slides and networking. Dynamic codes for conferences, weddings and meetups.',
    keywords: ['event check-in QR', 'conference badge QR', 'wedding QR code'],
    description:
      'Use QR on badges for attendee profiles, session materials or calendar adds. Update links if rooms or times change.',
    benefits: [
      'Calendar event QR adds schedule in one tap',
      'Badge vCards for networking',
      'Geofenced redirects per venue zone',
      'Real-time scan counts per session',
    ],
    steps: [
      'Create event or vCard codes per attendee type',
      'Link to agenda, slides or live stream',
      'Print on badges, programs and signage',
      'Export scan report after the event',
    ],
    categoryId: 'event',
    relatedSolutionSlug: 'stadium-events',
    icon: 'ticket',
  },
  {
    slug: 'retail-loyalty',
    title: 'Retail Loyalty & SMS Signup',
    headline: 'Grow your list from the sales floor',
    metaDescription:
      'Retail QR codes for loyalty signup, SMS promos and product lookups. Track in-store engagement with scan analytics.',
    keywords: ['retail loyalty QR', 'store QR code marketing', 'SMS signup QR'],
    description:
      'Place codes at checkout, shelves and receipts to enroll shoppers in loyalty programs or SMS offers.',
    benefits: [
      'SMS QR pre-fills opt-in message',
      'Link to loyalty portal or app download',
      'Different codes per store for attribution',
      'Webhook new signups to your CRM',
    ],
    steps: [
      'Choose SMS or app download QR type',
      'Add offer copy and compliance text',
      'Print shelf talkers and receipt inserts',
      'Measure conversion by location',
    ],
    categoryId: 'sms',
    relatedSolutionSlug: 'retail-stores',
    icon: 'shopping-bag',
  },
  {
    slug: 'real-estate-listings',
    title: 'Real Estate Listing QR Codes',
    headline: 'More inquiries from yard signs and brochures',
    metaDescription:
      'Real estate QR codes on for-sale signs, open house flyers and listing sheets. Route buyers to tours, video walkthroughs and agent contact.',
    keywords: ['real estate QR code', 'for sale sign QR', 'open house QR'],
    description:
      'Buyers scan for listing details, 3D tours, mortgage calculators or agent vCards — update status when the home sells.',
    benefits: [
      'Dynamic link survives price or status changes',
      'vCard on sign rider for instant agent contact',
      'Track interest by neighborhood',
      'Password gate for off-market previews',
    ],
    steps: [
      'Create a URL QR to your listing page',
      'Add agent vCard as secondary print piece',
      'Place on signs, lockboxes and mailers',
      'Pause or redirect when listing closes',
    ],
    categoryId: 'url',
    relatedSolutionSlug: 'real-estate',
    icon: 'home',
  },
  {
    slug: 'healthcare-patient-info',
    title: 'Healthcare Patient Information',
    headline: 'After-visit instructions patients actually open',
    metaDescription:
      'Healthcare QR codes for patient education, appointment booking and portal login. HIPAA-aware workflows with password-protected links.',
    keywords: ['healthcare QR code', 'patient education QR', 'clinic QR code'],
    description:
      'Share care instructions, forms and follow-up booking without app installs. Update content when protocols change.',
    benefits: [
      'PDF QR for discharge instructions',
      'Password-protected links for sensitive docs',
      'Booking URL with analytics per clinic',
      'Print on handouts and waiting room posters',
    ],
    steps: [
      'Upload patient education PDF or portal URL',
      'Enable password if content is sensitive',
      'Print on exam room and lobby materials',
      'Review scan trends by department',
    ],
    categoryId: 'pdf',
    relatedSolutionSlug: 'healthcare-clinics',
    icon: 'heart-pulse',
  },
  {
    slug: 'museum-exhibits',
    title: 'Museum & Exhibit Audio Guides',
    headline: 'Richer stories behind every display',
    metaDescription:
      'Museum QR codes for exhibit labels, audio guides and donation pages. No app required — works on visitor phones.',
    keywords: ['museum QR code', 'exhibit QR label', 'gallery audio guide QR'],
    description:
      'Visitors scan for object stories, videos, translations and timed-entry info. Swap content when exhibitions rotate.',
    benefits: [
      'Multilingual landing pages per exhibit',
      'Donation and membership links',
      'Low-light friendly high-contrast QR styles',
      'Analytics by gallery zone',
    ],
    steps: [
      'Create URL or PDF codes per exhibit',
      'Add audio/video on a mobile landing page',
      'Print on placards and entrance signage',
      'Update when artifacts change',
    ],
    categoryId: 'url',
    relatedSolutionSlug: 'museums-venues',
    icon: 'landmark',
  },
  {
    slug: 'social-media-growth',
    title: 'Social Media Follower Growth',
    headline: 'Turn offline fans into followers',
    metaDescription:
      'Instagram, TikTok and LinkedIn QR codes for packaging, posters and retail displays. Grow social from physical touchpoints.',
    keywords: ['Instagram QR code marketing', 'social media QR', 'TikTok QR poster'],
    description:
      'Link directly to profiles, reels or link-in-bio pages. Track which stores or campaigns drive the most follows.',
    benefits: [
      'Dedicated QR types for Instagram, TikTok, LinkedIn',
      'Link hub for multiple social buttons',
      'Brand-colored frames for retail displays',
      'Scan analytics by placement',
    ],
    steps: [
      'Pick the social profile QR type you need',
      'Enter handle or profile URL',
      'Print on packaging, receipts and signage',
      'Compare scan volume by channel',
    ],
    categoryId: 'instagram',
    icon: 'share-2',
  },
  {
    slug: 'app-download-campaign',
    title: 'App Download Campaigns',
    headline: 'One QR for iOS and Android stores',
    metaDescription:
      'App download QR codes for posters, TV ads and product packaging. Smart routing to the right app store automatically.',
    keywords: ['app download QR code', 'App Store QR', 'mobile app marketing QR'],
    description:
      'Send users to the correct app store listing from any print or OOH placement. Change store URLs when you ship new versions.',
    benefits: [
      'Dynamic redirect to App Store or Play Store',
      'Campaign-specific codes for attribution',
      'Landing page fallback for desktop scanners',
      'High-resolution export for billboards',
    ],
    steps: [
      'Create an app download QR with store links',
      'Design a bold code for large-format print',
      'Distribute unique codes per ad placement',
      'Monitor installs proxy via scan spikes',
    ],
    categoryId: 'app',
    icon: 'smartphone',
  },
  {
    slug: 'feedback-surveys',
    title: 'Customer Feedback & Surveys',
    headline: 'More reviews and survey responses',
    metaDescription:
      'QR codes for Google reviews, NPS surveys and feedback forms on receipts, tables and packaging. Close the loop faster.',
    keywords: ['feedback QR code', 'survey QR code', 'Google review QR'],
    description:
      'Make it effortless to leave a review or complete a survey right after purchase or service.',
    benefits: [
      'Link to Google, Trustpilot or Typeform',
      'Table tent prompts after dining',
      'Webhook survey submissions to Slack',
      'Track response rate by location',
    ],
    steps: [
      'Create a URL QR to your review or survey form',
      'Print on receipts, packaging or table cards',
      'Use separate codes per location',
      'Follow up on low-score alerts via webhook',
    ],
    categoryId: 'url',
    icon: 'message-square',
  },
  {
    slug: 'employee-onboarding',
    title: 'Employee Onboarding & HR',
    headline: 'Paperless onboarding for new hires',
    metaDescription:
      'HR QR codes for employee handbooks, benefits enrollment and IT setup. Update policies without reprinting binders.',
    keywords: ['employee onboarding QR', 'HR handbook QR', 'workplace QR code'],
    description:
      'New hires scan for handbooks, benefits portals, Wi‑Fi and equipment requests — all from one welcome sheet.',
    benefits: [
      'PDF handbook with always-current link',
      'Wi‑Fi QR for day-one connectivity',
      'Password-protected internal docs',
      'Workspace SSO for team rollouts',
    ],
    steps: [
      'Bundle handbook PDF and portal links',
      'Print on welcome packets and badges',
      'Restrict sensitive links with passwords',
      'Update destinations when policies change',
    ],
    categoryId: 'pdf',
    relatedSolutionSlug: 'coworking-spaces',
    icon: 'users',
  },
  {
    slug: 'nonprofit-donations',
    title: 'Nonprofit Donation Campaigns',
    headline: 'Frictionless giving from posters and events',
    metaDescription:
      'Fundraising QR codes for donation pages, recurring gifts and event ticketing. Track campaign performance by placement.',
    keywords: ['donation QR code', 'fundraising QR', 'charity QR code'],
    description:
      'Supporters scan to donate, register for walks or share campaign stories on social media.',
    benefits: [
      'Link to Stripe or donation platform',
      'Event registration with calendar add',
      'Print on posters, jars and mailers',
      'Geofenced campaigns for local chapters',
    ],
    steps: [
      'Create a URL QR to your donation flow',
      'Brand with nonprofit colors and logo',
      'Deploy on print and event signage',
      'Report scan totals to sponsors',
    ],
    categoryId: 'url',
    relatedSolutionSlug: 'nonprofit-fundraising',
    icon: 'heart',
  },
  {
    slug: 'education-campus',
    title: 'Campus Wayfinding & Resources',
    headline: 'Help students find rooms and resources',
    metaDescription:
      'University QR codes for campus maps, course materials, club signups and event calendars. Update each semester easily.',
    keywords: ['campus QR code', 'university QR', 'school QR code'],
    description:
      'Place codes on buildings, syllabi and club flyers for maps, LMS links and office hours.',
    benefits: [
      'Location QR opens maps with building pin',
      'PDF syllabi and reading lists',
      'Club link hubs for multi-channel presence',
      'Analytics per building or department',
    ],
    steps: [
      'Map QR codes for major buildings',
      'Link syllabi PDFs for each course',
      'Print on orientation materials',
      'Refresh links each term',
    ],
    categoryId: 'location',
    relatedSolutionSlug: 'university-campus',
    icon: 'graduation-cap',
  },
  {
    slug: 'logistics-tracking',
    title: 'Logistics & Warehouse Labels',
    headline: 'Scan-to-track pallets and shipments',
    metaDescription:
      'Logistics QR codes for shipment tracking, receiving docs and safety checklists. Dynamic links for live status pages.',
    keywords: ['logistics QR code', 'warehouse QR label', 'shipment tracking QR'],
    description:
      'Operators scan labels for picking instructions, MSDS sheets or proof-of-delivery portals.',
    benefits: [
      'Unique dynamic URL per shipment batch',
      'PDF safety data sheets on demand',
      'API bulk create for label runs',
      'Webhook scan events to WMS',
    ],
    steps: [
      'Bulk-create URL codes via CSV or API',
      'Link to tracking or checklist pages',
      'Print on labels and dock signage',
      'Integrate scan webhooks with WMS',
    ],
    categoryId: 'url',
    relatedSolutionSlug: 'logistics-warehouses',
    icon: 'truck',
  },
  {
    slug: 'video-marketing',
    title: 'Video & YouTube Marketing',
    headline: 'Play your story from any print piece',
    metaDescription:
      'YouTube and video QR codes for packaging, posters and retail displays. Drive views from offline touchpoints.',
    keywords: ['YouTube QR code', 'video marketing QR', 'QR to video'],
    description:
      'Link print campaigns directly to product demos, testimonials or how-to videos on YouTube or your site.',
    benefits: [
      'Dedicated YouTube channel or video QR type',
      'Landing page with embedded player',
      'Track which placements drive views',
      'Update video URL without reprint',
    ],
    steps: [
      'Create a YouTube or URL QR to your video',
      'Use a video play CTA on the landing page',
      'Print on packaging and retail displays',
      'Compare scan rates across SKUs',
    ],
    categoryId: 'youtube',
    icon: 'play-circle',
  },
  {
    slug: 'whatsapp-support',
    title: 'WhatsApp Customer Support',
    headline: 'Let customers message you instantly',
    metaDescription:
      'WhatsApp QR codes for product labels, receipts and storefronts. Pre-filled messages for orders and support.',
    keywords: ['WhatsApp QR code', 'WhatsApp business QR', 'customer support QR'],
    description:
      'Shoppers scan to open WhatsApp with your business number and a pre-written order or support message.',
    benefits: [
      'Pre-filled message templates per SKU',
      'Works on packaging and business cards',
      'Track scan volume by store',
      'Multilingual message variants via routing',
    ],
    steps: [
      'Create a WhatsApp QR with your business number',
      'Set default message for orders or support',
      'Print on labels, windows and receipts',
      'Route after-hours scans to FAQ page',
    ],
    categoryId: 'whatsapp',
    icon: 'message-circle',
  },
];

export function getUseCaseBySlug(slug: string): UseCasePage | undefined {
  return USE_CASE_PAGES.find((p) => p.slug === slug);
}

/** Homepage and blog sidebar featured guides */
export const FEATURED_USE_CASE_SLUGS = [
  'product-packaging',
  'trade-show-leads',
  'restaurant-table-tents',
  'hotel-guest-experience',
  'event-check-in',
  'social-media-growth',
] as const;

/** Footer deep links — high-intent SEO pages */
export const FOOTER_USE_CASE_SLUGS = [
  'product-packaging',
  'restaurant-table-tents',
  'real-estate-listings',
  'healthcare-patient-info',
  'whatsapp-support',
] as const;

/** Map QR category → related use-case slugs for cross-linking */
export const USE_CASES_BY_QR_CATEGORY: Record<string, string[]> = {
  url: ['product-packaging', 'print-advertising', 'feedback-surveys'],
  menu: ['restaurant-table-tents'],
  vcard: ['email-signature', 'trade-show-leads'],
  wifi: ['hotel-guest-experience'],
  event: ['event-check-in'],
  instagram: ['social-media-growth'],
  youtube: ['video-marketing'],
  whatsapp: ['whatsapp-support'],
  app: ['app-download-campaign'],
  pdf: ['healthcare-patient-info', 'employee-onboarding'],
  location: ['education-campus'],
  sms: ['retail-loyalty'],
};
