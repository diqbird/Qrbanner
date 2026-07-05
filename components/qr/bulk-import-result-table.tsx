'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';

type CreatedQr = { id: string; name: string; shortCode: string; category: string };

export function BulkImportResultTable({
  created,
  t,
}: {
  created: CreatedQr[];
  t: (key: string) => string;
}) {
  return (
    <div className="max-h-80 overflow-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('bulk.name')}</TableHead>
            <TableHead>{t('bulk.shortCode')}</TableHead>
            <TableHead>{t('bulk.category')}</TableHead>
            <TableHead className="text-right">{t('bulk.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {created.map((qr) => (
            <TableRow key={qr.id}>
              <TableCell className="font-medium">{qr.name}</TableCell>
              <TableCell>
                <code className="text-xs">{qr.shortCode}</code>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{qr.category}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/qr/${qr.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    {t('bulk.edit')} <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
