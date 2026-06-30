export interface ScheduleData {
  timezone: string;
  openTime: string;
  closeTime: string;
  days: number[];
  openUrl: string;
  closedUrl: string;
  dayUrls: Record<string, string>;
}

export const emptyScheduleData: ScheduleData = {
  timezone: 'Europe/Istanbul',
  openTime: '09:00',
  closeTime: '22:00',
  days: [1, 2, 3, 4, 5, 6],
  openUrl: '',
  closedUrl: '',
  dayUrls: {},
};

export const TIMEZONE_OPTIONS = [
  { value: 'Europe/Istanbul', label: 'Istanbul (TR)' },
  { value: 'Europe/London', label: 'London (UK)' },
  { value: 'Europe/Berlin', label: 'Berlin (DE)' },
  { value: 'Europe/Paris', label: 'Paris (FR)' },
  { value: 'America/New_York', label: 'New York (US)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (US)' },
  { value: 'Asia/Dubai', label: 'Dubai (AE)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JP)' },
  { value: 'UTC', label: 'UTC' },
];

export const DAY_LABELS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

function parseSchedule(raw: unknown): ScheduleData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const d = raw as Partial<ScheduleData>;
  return {
    timezone: d.timezone || 'Europe/Istanbul',
    openTime: d.openTime || '09:00',
    closeTime: d.closeTime || '22:00',
    days: Array.isArray(d.days) ? d.days : [1, 2, 3, 4, 5, 6],
    openUrl: d.openUrl || '',
    closedUrl: d.closedUrl || '',
    dayUrls: d.dayUrls && typeof d.dayUrls === 'object' ? d.dayUrls : {},
  };
}

export function getZonedParts(timezone: string, date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || 'UTC',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    day: dayMap[parts.weekday] ?? 0,
    hour: parseInt(parts.hour, 10) || 0,
    minute: parseInt(parts.minute, 10) || 0,
  };
}

function isWithinHours(openTime: string, closeTime: string, hour: number, minute: number): boolean {
  const [oh, om] = openTime.split(':').map((n) => parseInt(n, 10) || 0);
  const [ch, cm] = closeTime.split(':').map((n) => parseInt(n, 10) || 0);
  const now = hour * 60 + minute;
  const start = oh * 60 + om;
  const end = ch * 60 + cm;
  if (start <= end) {
    return now >= start && now < end;
  }
  return now >= start || now < end;
}

/** Returns scheduled URL or null to use default targetUrl */
export function resolveScheduledUrl(
  scheduleData: unknown,
  defaultUrl: string
): string | null {
  const schedule = parseSchedule(scheduleData);
  if (!schedule) return null;

  const { day, hour, minute } = getZonedParts(schedule.timezone);

  const dayKey = String(day);
  if (schedule.dayUrls[dayKey]?.trim()) {
    return schedule.dayUrls[dayKey].trim();
  }

  if (schedule.days.length > 0 && !schedule.days.includes(day)) {
    return schedule.closedUrl?.trim() || defaultUrl;
  }

  const isOpen = isWithinHours(schedule.openTime, schedule.closeTime, hour, minute);

  if (isOpen && schedule.openUrl?.trim()) {
    return schedule.openUrl.trim();
  }
  if (!isOpen && schedule.closedUrl?.trim()) {
    return schedule.closedUrl.trim();
  }

  return defaultUrl;
}
