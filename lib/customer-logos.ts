/** Industry wordmarks — replace SVGs in /public/logos/ with real client logos when available. */
export interface CustomerLogo {
  id: string;
  label: string;
  imageSrc?: string;
}

export const CUSTOMER_LOGOS: CustomerLogo[] = [
  { id: 'fnb', label: 'Food & Beverage', imageSrc: '/logos/fnb.svg' },
  { id: 'retail', label: 'Retail', imageSrc: '/logos/retail.svg' },
  { id: 'hotels', label: 'Hotels', imageSrc: '/logos/hotels.svg' },
  { id: 'events', label: 'Events', imageSrc: '/logos/events.svg' },
  { id: 'health', label: 'Healthcare', imageSrc: '/logos/health.svg' },
  { id: 'agencies', label: 'Agencies', imageSrc: '/logos/agencies.svg' },
  { id: 'education', label: 'Education', imageSrc: '/logos/education.svg' },
  { id: 'government', label: 'Government', imageSrc: '/logos/government.svg' },
  { id: 'grocery', label: 'Grocery', imageSrc: '/logos/grocery.svg' },
  { id: 'cinema', label: 'Cinema', imageSrc: '/logos/cinema.svg' },
  { id: 'logistics', label: 'Logistics', imageSrc: '/logos/logistics.svg' },
  { id: 'brewery', label: 'Brewery & Beverage', imageSrc: '/logos/brewery.svg' },
  { id: 'insurance', label: 'Insurance', imageSrc: '/logos/insurance.svg' },
  { id: 'childcare', label: 'Childcare', imageSrc: '/logos/childcare.svg' },
  { id: 'home-services', label: 'Home Services', imageSrc: '/logos/home-services.svg' },
  { id: 'marina', label: 'Marina & Boating', imageSrc: '/logos/marina.svg' },
  { id: 'staffing', label: 'Staffing & HR', imageSrc: '/logos/staffing.svg' },
  { id: 'trade-show', label: 'Trade Shows', imageSrc: '/logos/trade-show.svg' },
  { id: 'cafe', label: 'Coffee & Cafés', imageSrc: '/logos/cafe.svg' },
  { id: 'tourism', label: 'Tourism', imageSrc: '/logos/tourism.svg' },
  { id: 'bakery', label: 'Bakery & Pastry', imageSrc: '/logos/bakery.svg' },
  { id: 'landscaping', label: 'Landscaping', imageSrc: '/logos/landscaping.svg' },
  { id: 'faith', label: 'Faith Organizations', imageSrc: '/logos/faith.svg' },
];
