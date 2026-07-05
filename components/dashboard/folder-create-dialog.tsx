'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { FolderPlus } from 'lucide-react';
import { FolderColorPicker } from './folder-color-picker';
import type { FolderManagerState } from '@/hooks/use-folder-manager';

type FolderCreateDialogProps = {
  manager: FolderManagerState;
};

export function FolderCreateDialog({ manager }: FolderCreateDialogProps) {
  const {
    t,
    createOpen,
    setCreateOpen,
    newName,
    setNewName,
    newColor,
    setNewColor,
    creating,
    createFolder,
  } = manager;

  return (
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
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('folders.namePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('folders.color')}</Label>
            <FolderColorPicker value={newColor} onChange={setNewColor} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createFolder} disabled={creating}>
            {creating ? t('folders.creating') : t('folders.createBtn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
