'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FolderPlus, FolderOpen, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { FOLDER_COLORS, normalizeFolderName } from '@/lib/organize-utils';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';

interface FolderManagerProps {
  folders: QRFolderOption[];
  activeFolderId: string | null;
  unfiledActive?: boolean;
  onSelectFolder: (folderId: string | null, unfiled?: boolean) => void;
  onFoldersChange: () => void;
}

export function FolderManager({
  folders,
  activeFolderId,
  unfiledActive,
  onSelectFolder,
  onFoldersChange,
}: FolderManagerProps) {
  const { t } = useLanguage();
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(FOLDER_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [editFolder, setEditFolder] = useState<QRFolderOption | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState(FOLDER_COLORS[0]);

  const createFolder = async () => {
    const name = normalizeFolderName(newName);
    if (!name) return toast.error(t('folders.enterName'));
    setCreating(true);
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: newColor }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error ?? t('folders.createFailed'));
      toast.success(t('folders.created'));
      setCreateOpen(false);
      setNewName('');
      onFoldersChange();
      onSelectFolder(data.folder.id);
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setCreating(false);
    }
  };

  const saveEdit = async () => {
    if (!editFolder) return;
    const name = normalizeFolderName(editName);
    if (!name) return toast.error(t('folders.enterName'));
    try {
      const res = await fetch(`/api/folders/${editFolder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: editColor }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error ?? t('folders.updateFailed'));
      toast.success(t('folders.updated'));
      setEditFolder(null);
      onFoldersChange();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const deleteFolder = async (folder: QRFolderOption) => {
    if (!confirm(t('folders.deleteConfirm', { name: folder.name }))) return;
    try {
      const res = await fetch(`/api/folders/${folder.id}`, { method: 'DELETE' });
      if (!res.ok) return toast.error(t('folders.deleteFailed'));
      toast.success(t('folders.deleted'));
      if (activeFolderId === folder.id) onSelectFolder(null);
      onFoldersChange();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const ColorPicker = ({ value, onChange }: { value: string; onChange: (c: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {FOLDER_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`h-7 w-7 rounded-full border-2 transition-transform ${
            value === c ? 'border-foreground scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{t('folders.title')}</p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
              <FolderPlus className="h-3.5 w-3.5" /> {t('folders.new')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('folders.createTitle')}</DialogTitle>
              <DialogDescription>{t('folders.createDesc')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t('folders.name')}</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('folders.namePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label>{t('folders.color')}</Label>
                <ColorPicker value={newColor} onChange={setNewColor} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createFolder} disabled={creating}>
                {creating ? t('folders.creating') : t('folders.createBtn')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectFolder(null)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            !activeFolderId && !unfiledActive
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/40'
          }`}
        >
          {t('folders.all')}
        </button>
        <button
          type="button"
          onClick={() => onSelectFolder(null, true)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            unfiledActive
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/40'
          }`}
        >
          {t('folders.unfiled')}
        </button>
        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center">
            <button
              type="button"
              onClick={() => onSelectFolder(folder.id)}
              className={`flex items-center gap-1.5 rounded-l-lg border border-r-0 px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFolderId === folder.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: folder.color }} />
              {folder.name}
              <span className="text-muted-foreground">({folder.qrCount ?? 0})</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-[30px] rounded-l-none px-1.5 ${
                    activeFolderId === folder.id ? 'border-primary' : ''
                  }`}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditFolder(folder);
                    setEditName(folder.name);
                    setEditColor(folder.color);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> {t('folders.rename')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteFolder(folder)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> {t('folders.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Dialog open={!!editFolder} onOpenChange={(open) => !open && setEditFolder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('folders.editTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('folders.name')}</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('folders.color')}</Label>
              <ColorPicker value={editColor} onChange={setEditColor} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveEdit}>{t('folders.saveChanges')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MoveToFolderMenuProps {
  qrId: string;
  folders: QRFolderOption[];
  currentFolderId?: string | null;
  onMoved: () => void;
}

export function MoveToFolderMenu({ qrId, folders, currentFolderId, onMoved }: MoveToFolderMenuProps) {
  const { t } = useLanguage();
  const move = async (folderId: string | null) => {
    try {
      const res = await fetch('/api/qr/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrIds: [qrId], folderId }),
      });
      if (!res.ok) return toast.error(t('folders.moveFailed'));
      toast.success(folderId ? t('folders.movedToFolder') : t('folders.removedFromFolder'));
      onMoved();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-8">
          <FolderOpen className="h-3.5 w-3.5" /> {t('folders.move')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => move(null)} disabled={!currentFolderId}>
          {t('folders.removeFromFolder')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {folders.length === 0 ? (
          <DropdownMenuItem disabled>{t('folders.noFoldersYet')}</DropdownMenuItem>
        ) : (
          folders.map((f) => (
            <DropdownMenuItem
              key={f.id}
              onClick={() => move(f.id)}
              disabled={currentFolderId === f.id}
            >
              <span className="mr-2 h-2 w-2 rounded-full inline-block" style={{ backgroundColor: f.color }} />
              {f.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
