function escapeJsString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '\\u003c');
}

/** Client-safe beacon snippet for hub link CTA tracking (no server imports). */
export function renderHubLinkBeacon(shortCode: string, label: string): string {
  const sc = escapeJsString(shortCode);
  const lb = escapeJsString(label);
  return `onclick="try{var p=JSON.stringify({shortCode:'${sc}',ctaType:'hub',ctaLabel:'${lb}'});navigator.sendBeacon&&navigator.sendBeacon('/api/landing-cta',new Blob([p],{type:'application/json'}))}catch(e){}"`;
}
