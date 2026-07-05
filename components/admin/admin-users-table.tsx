'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import type { AdminContentState } from '@/hooks/use-admin-content';

type AdminUsersTableProps = {
  admin: AdminContentState;
};

export function AdminUsersTable({ admin }: AdminUsersTableProps) {
  const { t, users, search, setSearch, planFilter, setPlanFilter, fetchData, updateUser } = admin;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5" /> {t('admin.membersTitle')}
        </CardTitle>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-2">
          <Input
            placeholder={t('admin.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder={t('admin.allPlans')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.allPlans')}</SelectItem>
              <SelectItem value="free">{t('admin.planFree')}</SelectItem>
              <SelectItem value="pro">{t('admin.planPro')}</SelectItem>
              <SelectItem value="business">{t('admin.planBusiness')}</SelectItem>
              <SelectItem value="agency">{t('admin.planAgency')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => fetchData()}>
            {t('admin.refresh')}
          </Button>
        </div>
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
                <TableRow key={u.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{u.name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                      {!u.emailVerified && (
                        <Badge variant="outline" className="mt-1 text-[10px]">
                          {t('admin.unverified')}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={u.plan} onValueChange={(plan) => updateUser(u.id, { plan })}>
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
                      variant={u.billingStatus === 'stripe' ? 'secondary' : 'outline'}
                      className="text-[10px] font-normal"
                    >
                      {u.billingStatus === 'stripe'
                        ? t('admin.billingStripe')
                        : u.billingStatus === 'manual'
                          ? t('admin.billingManual')
                          : t('admin.billingFree')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(role) => updateUser(u.id, { role })}>
                      <SelectTrigger className="h-8 w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">{t('admin.roleUser')}</SelectItem>
                        <SelectItem value="admin">{t('admin.roleAdmin')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{u.qrCount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
