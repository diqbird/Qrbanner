const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim();

function isValidGtmId(id: string) {
  return /^GTM-[A-Z0-9]+$/i.test(id);
}

/** GTM container snippet — must be in <head> for Search Console verification */
export function SiteGoogleTagManagerHead() {
  if (!GTM_ID || !isValidGtmId(GTM_ID)) return null;

  const id = GTM_ID.toUpperCase();

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`,
      }}
    />
  );
}

/** GTM noscript fallback — immediately after opening <body> */
export function SiteGoogleTagManagerBody() {
  if (!GTM_ID || !isValidGtmId(GTM_ID)) return null;

  const id = GTM_ID.toUpperCase();

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
