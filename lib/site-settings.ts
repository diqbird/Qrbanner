export type SiteSettings = {
  showQrDescription: boolean;
  /** Site-wide announcement banner (managed from Super Admin → Banners). */
  announcementEnabled: boolean;
  announcementText: string;
  announcementTextTr: string;
  announcementLink: string;
};
