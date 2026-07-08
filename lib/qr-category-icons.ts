import type { ComponentType } from 'react';
import {
  Globe, Contact, Wifi, Mail, MessageSquare, Phone,
  Calendar, FileText, Share2, Download, MapPin, Bitcoin, Type, Video,
  Music, MessageCircle, Instagram, Youtube, Linkedin, Facebook, Link2, Package,
  Star, CreditCard,
} from 'lucide-react';

export const QR_CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  url: Globe,
  text: Type,
  vcard: Contact,
  wifi: Wifi,
  email: Mail,
  sms: MessageSquare,
  phone: Phone,
  location: MapPin,
  event: Calendar,
  menu: FileText,
  social: Share2,
  app: Download,
  pdf: FileText,
  file: FileText,
  whatsapp: MessageCircle,
  telegram: MessageCircle,
  discord: MessageCircle,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Share2,
  linkedin: Linkedin,
  youtube: Youtube,
  spotify: Music,
  zoom: Video,
  google_meet: Video,
  crypto: Bitcoin,
  link_hub: Link2,
  gs1: Package,
  google_review: Star,
  paypal: CreditCard,
};

export const QR_CREATE_STEP_KEYS = [
  'create.steps.start',
  'create.steps.content',
  'create.steps.design',
  'create.steps.review',
] as const;
