'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PLANS } from '@/lib/plans';
import type { AdminContentState } from '@/hooks/use-admin-content';

type AdminUser = AdminContentState['users'][number];

type AdminUsersTableRowProps = {
  user: AdminUser;
  t: AdminContentState['t'];
  updateUser: AdminContentState['updateUser'];
};

export function AdminUsersTableRow({ user, t, updateUser }: AdminUsersTableRowProps) {
  return (
    <TableRow key={user.id}>
      <TableCell>
        <div>
          <p className="font-medium text-sm">{user.name || '—'}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {!user.emailVerified && (
            <Badge variant="outline" className="mt-1 text-[10px]">
              {t('admin.unverified')}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Select value={user.plan} onValueChange={(plan) => updateUser(user.id, { plan })}>
          <SelectTrigger className="h-8 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PLANS).map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Badge
          variant={user.billingStatus === 'paddle' ? 'secondary' : 'outline'}
          className="text-[10px] font-normal"
        >
          {user.billingStatus === 'paddle'
            ? t('admin.billingPaddle')
            : user.billingStatus === 'manual'
              ? t('admin.billingManual')
              : t('admin.billingFree')}
        </Badge>
      </TableCell>
      <TableCell>
        <Select value={user.role} onValueChange={(role) => updateUser(user.id, { role })}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">{t('admin.roleUser')}</SelectItem>
            <SelectItem value="admin">{t('admin.roleAdmin')}</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{user.qrCount}</TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(user.createdAt).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}
