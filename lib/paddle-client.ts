type PaddleCheckoutSettings = {
  displayMode?: 'overlay' | 'inline';
  theme?: 'light' | 'dark';
  successUrl?: string;
};

type PaddleInstance = {
  Environment: { set: (env: 'sandbox' | 'production') => void };
  Initialize: (options: {
    token: string;
    checkout?: { settings?: PaddleCheckoutSettings };
  }) => void;
  Checkout: {
    open: (options: { transactionId: string; settings?: PaddleCheckoutSettings }) => void;
  };
};

declare global {
  interface Window {
    Paddle?: PaddleInstance;
  }
}

const PADDLE_SCRIPT = 'https://cdn.paddle.com/paddle/v2/paddle.js';

export type PaddleClientConfig = {
  clientToken: string;
  environment: 'sandbox' | 'production';
};

let paddleInit: Promise<void> | null = null;
let cachedConfig: PaddleClientConfig | null = null;

function loadPaddleScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Paddle checkout requires a browser'));
  }
  if (window.Paddle) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PADDLE_SCRIPT}"]`);
    if (existing) {
      if (window.Paddle) resolve();
      else existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Paddle script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.src = PADDLE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Paddle script failed to load'));
    document.head.appendChild(script);
  });
}

export async function fetchPaddleClientConfig(): Promise<PaddleClientConfig> {
  if (cachedConfig) return cachedConfig;

  const res = await fetch('/api/billing/status', { cache: 'no-store' });
  const data = (await res.json()) as {
    paddle?: { clientToken?: string | null; environment?: 'sandbox' | 'production' };
  };

  const clientToken = data.paddle?.clientToken;
  if (!clientToken) {
    throw new Error('paddle_client_token_missing');
  }

  cachedConfig = {
    clientToken,
    environment: data.paddle?.environment === 'sandbox' ? 'sandbox' : 'production',
  };
  return cachedConfig;
}

export async function initPaddleCheckout(): Promise<void> {
  if (!paddleInit) {
    paddleInit = (async () => {
      const config = await fetchPaddleClientConfig();
      await loadPaddleScript();
      if (!window.Paddle) throw new Error('Paddle script unavailable');

      if (config.environment === 'sandbox') {
        window.Paddle.Environment.set('sandbox');
      }

      window.Paddle.Initialize({
        token: config.clientToken,
        checkout: {
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            successUrl: `${window.location.origin}/settings?billing=success`,
          },
        },
      });
    })();
  }

  await paddleInit;
}

export async function openPaddleCheckout(transactionId: string): Promise<void> {
  await initPaddleCheckout();
  if (!window.Paddle) throw new Error('Paddle script unavailable');
  window.Paddle.Checkout.open({ transactionId });
}

export function extractPaddleTransactionId(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.searchParams.get('_ptxn');
  } catch {
    return null;
  }
}

export async function openPaddleCheckoutFromUrl(url: string): Promise<boolean> {
  const transactionId = extractPaddleTransactionId(url);
  if (!transactionId) return false;
  await openPaddleCheckout(transactionId);
  return true;
}
