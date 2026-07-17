/**
 * Shared Content-Security-Policy builder for middleware (per-request nonce)
 * and a static fallback for routes that skip middleware.
 *
 * Keep third-party allowlists here only — do not duplicate CSP elsewhere.
 */

/**
 * @param {{ nonce?: string }} [options]
 * @returns {string}
 */
function buildContentSecurityPolicy(options = {}) {
  const isProd = process.env.NODE_ENV === 'production';
  const nonce = typeof options.nonce === 'string' && options.nonce ? options.nonce : '';

  // Per-request nonce on HTML (middleware). Host allowlists stay so third-party
  // src= tags (gtag, unpkg Swagger) keep working. 'unsafe-inline' remains as a
  // fallback for agents that do not understand nonces (ignored when nonce matches
  // in CSP3 browsers). Enable 'strict-dynamic' later after console violation audit.
  const scriptSrc = nonce
    ? [
        "script-src 'self'",
        `'nonce-${nonce}'`,
        "'unsafe-inline'",
        isProd ? null : "'unsafe-eval'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://connect.facebook.net',
        'https://client.crisp.chat',
        'https://challenges.cloudflare.com',
        'https://cdn.paddle.com',
        'https://unpkg.com',
      ]
        .filter(Boolean)
        .join(' ')
    : isProd
      ? "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://client.crisp.chat https://challenges.cloudflare.com https://cdn.paddle.com https://unpkg.com"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://client.crisp.chat https://challenges.cloudflare.com https://cdn.paddle.com https://unpkg.com";

  const directives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://client.crisp.chat https://unpkg.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.facebook.com https://client.crisp.chat wss://client.relay.crisp.chat wss://relay.crisp.chat https://api.paddle.com https://sandbox-api.paddle.com https://checkout-service.paddle.com https://sandbox-checkout-service.paddle.com",
    "frame-src 'self' https://www.googletagmanager.com https://www.youtube-nocookie.com https://www.youtube.com https://www.loom.com https://client.crisp.chat https://challenges.cloudflare.com https://buy.paddle.com https://sandbox-buy.paddle.com https://checkout.paddle.com https://sandbox-checkout.paddle.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "manifest-src 'self'",
  ];

  if (isProd) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

module.exports = { buildContentSecurityPolicy };
