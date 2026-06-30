const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

/** Site-wide GA4 — gtag.js in <head> for Search Console + analytics */
export function SiteGoogleAnalytics() {
  if (!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID)) return null;

  const id = GA_ID.toUpperCase();

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}');
          `,
        }}
      />
    </>
  );
}
