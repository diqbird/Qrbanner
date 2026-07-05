'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { FolderColorPicker } from './folder-color-picker';
import type { FolderManagerState } from '@/hooks/use-folder-manager';

type FolderEditDialogProps = {
  manager: FolderManagerState;
};

export function FolderEditDialog({ manager }: FolderEditDialogProps) {
  const { t, editFolder, setEditFolder, editName, setEditName, editColor, setEditColor, saveEdit } = manager;

  return (
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
            <FolderColorPicker value={editColor} onChange={setEditColor} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveEdit}>{t('folders.saveChanges')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
