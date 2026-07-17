/**
 * Shared Content-Security-Policy builder for next.config.js and middleware.
 * Keep third-party allowlists here only — do not duplicate CSP elsewhere.
 */
function buildContentSecurityPolicy() {
  const isProd = process.env.NODE_ENV === 'production';
  const scriptSrc = isProd
    ? "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://client.crisp.chat https://challenges.cloudflare.com https://cdn.paddle.com https://unpkg.com"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://client.crisp.chat https://challenges.cloudflare.com https://cdn.paddle.com https://unpkg.com";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://client.crisp.chat https://unpkg.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.facebook.com https://client.crisp.chat wss://client.relay.crisp.chat wss://relay.crisp.chat https://api.paddle.com https://sandbox-api.paddle.com https://checkout-service.paddle.com https://sandbox-checkout-service.paddle.com",
    "frame-src 'self' https://www.googletagmanager.com https://www.youtube-nocookie.com https://www.youtube.com https://www.loom.com https://client.crisp.chat https://challenges.cloudflare.com https://buy.paddle.com https://sandbox-buy.paddle.com https://checkout.paddle.com https://sandbox-checkout.paddle.com",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

module.exports = { buildContentSecurityPolicy };
