/** Session max-age when "Remember me" is checked (days). */
export const SESSION_REMEMBER_ME_DAYS = 30;

export const SESSION_REMEMBER_MAX_AGE_SEC = SESSION_REMEMBER_ME_DAYS * 24 * 60 * 60;

/** Default session max-age without "Remember me" (hours). */
export const SESSION_DEFAULT_MAX_AGE_HOURS = 24;

export const SESSION_DEFAULT_MAX_AGE_SEC = SESSION_DEFAULT_MAX_AGE_HOURS * 60 * 60;
