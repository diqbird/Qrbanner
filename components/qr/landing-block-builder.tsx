'use client';

import { Reorder, useDragControls } from 'framer-motion';
import {
  GripVertical,
  Trash2,
  Plus,
  Heading,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Link2,
  Share2,
  Video,
  ClipboardList,
  Minus,
  MoveVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/i18n/language-provider';
import type {
  LandingBlock,
  LandingBlockType,
  HubLink,
  SocialPlatform,
} from '@/lib/landing-page';
import { newBlockId, MAX_BLOCKS, MAX_LINKS_PER_BLOCK } from '@/lib/landing-blocks';

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'facebook',
  'twitter',
  'tiktok',
  'linkedin',
  'youtube',
  'whatsapp',
  'website',
];

const BLOCK_ICONS: Record<LandingBlockType, typeof Heading> = {
  heading: Heading,
  text: Type,
  image: ImageIcon,
  button: MousePointerClick,
  hubLinks: Link2,
  social: Share2,
  video: Video,
  leadForm: ClipboardList,
  divider: Minus,
  spacer: MoveVertical,
};

const ADD_ORDER: LandingBlockType[] = [
  'heading',
  'text',
  'image',
  'button',
  'hubLinks',
  'social',
  'video',
  'leadForm',
  'divider',
  'spacer',
];

function createBlock(type: LandingBlockType): LandingBlock {
  const id = newBlockId();
  switch (type) {
    case 'heading':
      return { id, type, text: '', level: 1, align: 'center' };
    case 'text':
      return { id, type, text: '', align: 'center' };
    case 'image':
      return { id, type, url: '', alt: '', rounded: true };
    case 'button':
      return { id, type, label: '', url: '', variant: 'solid' };
    case 'hubLinks':
      return { id, type, links: [{ label: '', url: '' }] };
    case 'social':
      return { id, type, links: [{ platform: 'instagram', url: '' }] };
    case 'video':
      return { id, type, url: '' };
    case 'leadForm':
      return {
        id,
        type,
        config: {
          collectName: true,
          collectEmail: true,
          collectPhone: false,
          collectMessage: false,
          requiredEmail: true,
        },
        submitLabel: '',
      };
    case 'divider':
      return { id, type };
    case 'spacer':
      return { id, type, size: 'md' };
  }
}

type T = (key: string) => string;

function AlignField({
  value,
  onChange,
  t,
}: {
  value: string | undefined;
  onChange: (v: 'left' | 'center' | 'right') => void;
  t: T;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{t('landingBuilder.align')}</Label>
      <Select value={value ?? 'center'} onValueChange={(v) => onChange(v as 'left' | 'center' | 'right')}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left">{t('landingBuilder.alignLeft')}</SelectItem>
          <SelectItem value="center">{t('landingBuilder.alignCenter')}</SelectItem>
          <SelectItem value="right">{t('landingBuilder.alignRight')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function BlockFields({
  block,
  patch,
  t,
}: {
  block: LandingBlock;
  patch: (p: Partial<LandingBlock>) => void;
  t: T;
}) {
  switch (block.type) {
    case 'heading':
      return (
        <div className="space-y-3">
          <Input
            placeholder={t('landingBuilder.headingPlaceholder')}
            value={block.text}
            onChange={(e) => patch({ text: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('landingBuilder.level')}</Label>
              <Select
                value={String(block.level ?? 1)}
                onValueChange={(v) => patch({ level: Number(v) as 1 | 2 | 3 })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('landingBuilder.levelLarge')}</SelectItem>
                  <SelectItem value="2">{t('landingBuilder.levelMedium')}</SelectItem>
                  <SelectItem value="3">{t('landingBuilder.levelSmall')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlignField value={block.align} onChange={(v) => patch({ align: v })} t={t} />
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="space-y-3">
          <Textarea
            placeholder={t('landingBuilder.textPlaceholder')}
            value={block.text}
            rows={3}
            onChange={(e) => patch({ text: e.target.value })}
          />
          <AlignField value={block.align} onChange={(v) => patch({ align: v })} t={t} />
        </div>
      );
    case 'image':
      return (
        <div className="space-y-3">
          <Input
            placeholder={t('landingBuilder.imageUrlPlaceholder')}
            value={block.url}
            onChange={(e) => patch({ url: e.target.value })}
          />
          <Input
            placeholder={t('landingBuilder.altPlaceholder')}
            value={block.alt ?? ''}
            onChange={(e) => patch({ alt: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={Boolean(block.rounded)} onCheckedChange={(v) => patch({ rounded: v })} />
            {t('landingBuilder.rounded')}
          </label>
        </div>
      );
    case 'button':
      return (
        <div className="space-y-3">
          <Input
            placeholder={t('landingBuilder.buttonLabelPlaceholder')}
            value={block.label}
            onChange={(e) => patch({ label: e.target.value })}
          />
          <Input
            placeholder={t('landingBuilder.urlPlaceholder')}
            value={block.url}
            onChange={(e) => patch({ url: e.target.value })}
          />
          <div className="space-y-1.5">
            <Label className="text-xs">{t('landingBuilder.style')}</Label>
            <Select
              value={block.variant ?? 'solid'}
              onValueChange={(v) => patch({ variant: v as 'solid' | 'outline' })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">{t('landingBuilder.styleSolid')}</SelectItem>
                <SelectItem value="outline">{t('landingBuilder.styleOutline')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    case 'hubLinks': {
      const links = block.links ?? [];
      const setLink = (i: number, p: Partial<HubLink>) =>
        patch({ links: links.map((l, idx) => (idx === i ? { ...l, ...p } : l)) });
      return (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <Input
                className="flex-1"
                placeholder={t('landingBuilder.linkLabel')}
                value={link.label}
                onChange={(e) => setLink(i, { label: e.target.value })}
              />
              <Input
                className="flex-1"
                placeholder={t('landingBuilder.urlPlaceholder')}
                value={link.url}
                onChange={(e) => setLink(i, { url: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => patch({ links: links.filter((_, idx) => idx !== i) })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {links.length < MAX_LINKS_PER_BLOCK && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => patch({ links: [...links, { label: '', url: '' }] })}
            >
              <Plus className="h-3.5 w-3.5" />
              {t('landingBuilder.addLink')}
            </Button>
          )}
        </div>
      );
    }
    case 'social': {
      const links = block.links ?? [];
      const setLink = (i: number, p: Partial<{ platform: SocialPlatform; url: string }>) =>
        patch({ links: links.map((l, idx) => (idx === i ? { ...l, ...p } : l)) });
      return (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <Select
                value={link.platform}
                onValueChange={(v) => setLink(i, { platform: v as SocialPlatform })}
              >
                <SelectTrigger className="h-9 w-36 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(`landingBuilder.social.${p}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="flex-1"
                placeholder={t('landingBuilder.urlPlaceholder')}
                value={link.url}
                onChange={(e) => setLink(i, { url: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => patch({ links: links.filter((_, idx) => idx !== i) })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {links.length < MAX_LINKS_PER_BLOCK && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => patch({ links: [...links, { platform: 'instagram', url: '' }] })}
            >
              <Plus className="h-3.5 w-3.5" />
              {t('landingBuilder.addLink')}
            </Button>
          )}
        </div>
      );
    }
    case 'video':
      return (
        <div className="space-y-1.5">
          <Input
            placeholder={t('landingBuilder.videoPlaceholder')}
            value={block.url}
            onChange={(e) => patch({ url: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">{t('landingBuilder.videoHint')}</p>
        </div>
      );
    case 'leadForm': {
      const cfg = block.config;
      const setCfg = (p: Partial<typeof cfg>) => patch({ config: { ...cfg, ...p } });
      const rows: [keyof typeof cfg, string][] = [
        ['collectName', 'landingEditor.fieldName'],
        ['collectEmail', 'landingEditor.fieldEmail'],
        ['collectPhone', 'landingEditor.fieldPhone'],
        ['collectMessage', 'landingEditor.fieldMessage'],
      ];
      return (
        <div className="space-y-3">
          <Input
            placeholder={t('landingBuilder.submitLabelPlaceholder')}
            value={block.submitLabel ?? ''}
            onChange={(e) => patch({ submitLabel: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            {rows.map(([key, labelKey]) => (
              <label key={String(key)} className="flex items-center gap-2 text-sm">
                <Switch
                  checked={Boolean(cfg[key])}
                  onCheckedChange={(v) => setCfg({ [key]: v } as Partial<typeof cfg>)}
                />
                {t(labelKey)}
              </label>
            ))}
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <Switch
                checked={Boolean(cfg.requiredEmail)}
                onCheckedChange={(v) => setCfg({ requiredEmail: v })}
              />
              {t('landingEditor.requireEmail')}
            </label>
          </div>
        </div>
      );
    }
    case 'spacer':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{t('landingBuilder.spacerSize')}</Label>
          <Select value={block.size ?? 'md'} onValueChange={(v) => patch({ size: v as 'sm' | 'md' | 'lg' })}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">{t('landingBuilder.spacerSmall')}</SelectItem>
              <SelectItem value="md">{t('landingBuilder.spacerMedium')}</SelectItem>
              <SelectItem value="lg">{t('landingBuilder.spacerLarge')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    case 'divider':
      return <p className="text-xs text-muted-foreground">{t('landingBuilder.dividerHint')}</p>;
  }
}

function BlockRow({
  block,
  onPatch,
  onRemove,
  t,
}: {
  block: LandingBlock;
  onPatch: (p: Partial<LandingBlock>) => void;
  onRemove: () => void;
  t: T;
}) {
  const controls = useDragControls();
  const Icon = BLOCK_ICONS[block.type];
  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className="rounded-lg border border-border/60 bg-card"
    >
      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2">
        <button
          type="button"
          aria-label={t('landingBuilder.drag')}
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Icon className="h-4 w-4 text-primary" />
        <span className="flex-1 text-sm font-medium">{t(`landingBuilder.type.${block.type}`)}</span>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {block.type !== 'divider' && (
        <div className="p-3">
          <BlockFields block={block} patch={onPatch} t={t} />
        </div>
      )}
    </Reorder.Item>
  );
}

export function LandingBlockBuilder({
  blocks,
  onChange,
}: {
  blocks: LandingBlock[];
  onChange: (blocks: LandingBlock[]) => void;
}) {
  const { t } = useLanguage();
  const list = blocks ?? [];

  const patchBlock = (id: string, p: Partial<LandingBlock>) =>
    onChange(list.map((b) => (b.id === id ? ({ ...b, ...p } as LandingBlock) : b)));

  const removeBlock = (id: string) => onChange(list.filter((b) => b.id !== id));

  const addBlock = (type: LandingBlockType) => {
    if (list.length >= MAX_BLOCKS) return;
    onChange([...list, createBlock(type)]);
  };

  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
          <p className="text-sm text-muted-foreground">{t('landingBuilder.empty')}</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={list} onReorder={onChange} className="space-y-3">
          {list.map((block) => (
            <BlockRow
              key={block.id}
              block={block}
              onPatch={(p) => patchBlock(block.id, p)}
              onRemove={() => removeBlock(block.id)}
              t={t}
            />
          ))}
        </Reorder.Group>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={list.length >= MAX_BLOCKS}
          >
            <Plus className="h-4 w-4" />
            {list.length >= MAX_BLOCKS ? t('landingBuilder.maxReached') : t('landingBuilder.addBlock')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {ADD_ORDER.map((type) => {
            const Icon = BLOCK_ICONS[type];
            return (
              <DropdownMenuItem key={type} onClick={() => addBlock(type)} className="gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {t(`landingBuilder.type.${type}`)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
