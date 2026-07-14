/** Central rate-limit windows — all routes should use checkRateLimit() with these keys. */

export const AUTH_FORGOT_PASSWORD = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
  key: (ip: string) => `auth:forgot:${ip}`,
} as const;

export const AUTH_RESET_PASSWORD_IP = {
  limit: 10,
  windowMs: 15 * 60 * 1000,
  key: (ip: string) => `auth:reset:${ip}`,
} as const;

export const AUTH_RESET_PASSWORD_EMAIL = {
  limit: 6,
  windowMs: 15 * 60 * 1000,
  key: (email: string) => `auth:reset-verify:${email.toLowerCase().trim()}`,
} as const;

export const AUTH_CHANGE_PASSWORD = {
  limit: 10,
  windowMs: 15 * 60 * 1000,
  key: (userId: string) => `auth:change-password:${userId}`,
} as const;

export const AUTH_DELETE_ACCOUNT = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
  key: (userId: string) => `auth:delete-account:${userId}`,
} as const;

/** Password login — per IP (credential stuffing). */
export const AUTH_LOGIN_IP = {
  limit: 15,
  windowMs: 15 * 60 * 1000,
  key: (ip: string) => `auth:login:${ip}`,
} as const;

/** Password login — per email (account lockout protection). */
export const AUTH_LOGIN_EMAIL = {
  limit: 8,
  windowMs: 15 * 60 * 1000,
  key: (email: string) => `auth:login-email:${email.toLowerCase().trim()}`,
} as const;

/** Invite token lookup — per IP (enumeration / DB load). */
export const AUTH_INVITE_LOOKUP_IP = {
  limit: 40,
  windowMs: 15 * 60 * 1000,
  key: (ip: string) => `auth:invite-lookup:${ip}`,
} as const;

/** Invite accept — per IP. */
export const AUTH_INVITE_ACCEPT_IP = {
  limit: 20,
  windowMs: 15 * 60 * 1000,
  key: (ip: string) => `auth:invite-accept:${ip}`,
} as const;

/** Invite accept — per user. */
export const AUTH_INVITE_ACCEPT_USER = {
  limit: 10,
  windowMs: 15 * 60 * 1000,
  key: (userId: string) => `auth:invite-accept-user:${userId}`,
} as const;
