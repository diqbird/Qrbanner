'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { UserPlus } from 'lucide-react';
import type { AdminContentState } from '@/hooks/use-admin-content';
import { AdminUsersTableToolbar } from './admin-users-table-toolbar';
import { AdminUsersTableRow } from './admin-users-table-row';

type AdminUsersTableProps = {
  admin: AdminContentState;
};

export function AdminUsersTable({ admin }: AdminUsersTableProps) {
  const { t, users, updateUser } = admin;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5" /> {t('admin.membersTitle')}
        </CardTitle>
        <AdminUsersTableToolbar admin={admin} />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.memberCol')}</TableHead>
              <TableHead>{t('admin.planCol')}</TableHead>
              <TableHead>{t('admin.billingCol')}</TableHead>
              <TableHead>{t('admin.roleCol')}</TableHead>
              <TableHead>{t('admin.qrsCol')}</TableHead>
              <TableHead>{t('admin.joinedCol')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {t('admin.noMembers')}
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <AdminUsersTableRow key={u.id} user={u} t={t} updateUser={updateUser} />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
