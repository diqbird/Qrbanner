'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    SwaggerUIBundle?: (opts: Record<string, unknown>) => void;
  }
}

const SWAGGER_JS = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js';
const SWAGGER_CSS = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css';

function loadStylesheet(href: string): HTMLLinkElement {
  const existing = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);
  if (existing) return existing;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  return link;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (window.SwaggerUIBundle) resolve();
      else existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Swagger UI'));
    document.body.appendChild(script);
  });
}

export function SwaggerExplorer({
  specUrl = '/api/openapi.json',
  loadingLabel,
  errorLabel,
}: {
  specUrl?: string;
  loadingLabel: string;
  errorLabel: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    loadStylesheet(SWAGGER_CSS);
    loadScript(SWAGGER_JS)
      .then(() => {
        if (cancelled || !hostRef.current || !window.SwaggerUIBundle) {
          if (!cancelled) setStatus('error');
          return;
        }
        hostRef.current.innerHTML = '';
        const mount = document.createElement('div');
        mount.id = 'swagger-ui-root';
        hostRef.current.appendChild(mount);
        window.SwaggerUIBundle({
          url: specUrl,
          dom_id: '#swagger-ui-root',
          deepLinking: true,
          docExpansion: 'list',
          defaultModelsExpandDepth: 1,
          tryItOutEnabled: true,
          persistAuthorization: true,
        });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [specUrl]);

  return (
    <div className="swagger-explorer min-h-[480px]">
      {status === 'loading' ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{loadingLabel}</p>
      ) : null}
      {status === 'error' ? (
        <p className="py-10 text-center text-sm text-destructive">{errorLabel}</p>
      ) : null}
      <div ref={hostRef} className={status === 'ready' ? 'block' : 'sr-only'} />
    </div>
  );
}
