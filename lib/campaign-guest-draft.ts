/** Persist campaign wizard prompt fields across guest → signup/login. */

export const CAMPAIGN_GUEST_DRAFT_KEY = 'qrb_campaign_guest_draft';

export type CampaignGuestDraft = {
  version: 1;
  savedAt: string;
  prompt: string;
  businessName: string;
  websiteUrl: string;
};

export function saveCampaignGuestDraft(input: {
  prompt: string;
  businessName: string;
  websiteUrl: string;
}): void {
  try {
    const draft: CampaignGuestDraft = {
      version: 1,
      savedAt: new Date().toISOString(),
      prompt: input.prompt,
      businessName: input.businessName,
      websiteUrl: input.websiteUrl,
    };
    sessionStorage.setItem(CAMPAIGN_GUEST_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* quota or private mode */
  }
}

export function loadCampaignGuestDraft(): CampaignGuestDraft | null {
  try {
    const raw = sessionStorage.getItem(CAMPAIGN_GUEST_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CampaignGuestDraft;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearCampaignGuestDraft(): void {
  try {
    sessionStorage.removeItem(CAMPAIGN_GUEST_DRAFT_KEY);
  } catch {}
}
