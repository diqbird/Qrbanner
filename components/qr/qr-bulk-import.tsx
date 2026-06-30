'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle2,
  AlertCircle, Loader2, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BULK_CSV_TEMPLATE, parseBulkCSV,
  type BulkParsedRow, type BulkParseError,
} from '@/lib/bulk-csv';
import { useLanguage } from '@/components/i18n/language-provider';

interface CreatedQR {
  id: string;
  name: string;
  shortCode: string;
  category: string;
}

interface BulkResult {
  batchId: string;
  batchLabel: string | null;
  created: CreatedQR[];
  failed: BulkParseError[];
  summary: { total: number; success: number; failed: number };
}

interface UsageInfo {
  maxBulkRows: number;
  qrLimit: number;
  qrCodes: number;
  planName: string;
}

export function QRBulkImport() {
  const { t } = useLanguage();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [batchLabel, setBatchLabel] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<BulkParsedRow[]>([]);
  const [errors, setErrors] = useState<BulkParseError[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [usage, setUsage] = useState<UsageInfo>({
    maxBulkRows: 100,
    qrLimit: 25,
    qrCodes: 0,
    planName: 'Free',
  });

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.usage) return;
        setUsage({
          maxBulkRows: data.usage.bulkRowLimit ?? 100,
          qrLimit: data.usage.qrLimit ?? 25,
          qrCodes: data.usage.qrCodes ?? 0,
          planName: data.plan?.name ?? 'Free',
        });
      })
      .catch(() => undefined);
  }, []);

  const maxRows = usage.maxBulkRows;
  const slotsLeft = Math.max(0, usage.qrLimit - usage.qrCodes);

  const downloadTemplate = () => {
    const blob = new Blob([BULK_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrbanner-bulk-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = useCallback(
    (file: File) => {
      setResult(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? '');
        const parsed = parseBulkCSV(text, maxRows);
        setRows(parsed.rows);
        setErrors(parsed.errors);
        if (parsed.errors.length) {
          toast.error(t('bulk.rowsError', { count: parsed.errors.length }));
        } else if (parsed.rows.length) {
          toast.success(t('bulk.rowsReady', { count: parsed.rows.length }));
        } else {
          toast.error(t('bulk.noValidRows'));
        }
      };
      reader.onerror = () => toast.error(t('bulk.readFileError'));
      reader.readAsText(file);
    },
    [maxRows, t]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.name?.endsWith('.csv') || file?.type === 'text/csv') {
      handleFile(file);
    } else {
      toast.error(t('bulk.csvOnlyError'));
    }
  };

  const handleImport = async () => {
    if (!rows.length) {
      toast.error(t('bulk.uploadFirst'));
      return;
    }
    if (errors.length) {
      toast.error(t('bulk.fixErrors'));
      return;
    }
    if (rows.length > slotsLeft) {
      toast.error(
        t('bulk.slotsLeft', { remaining: slotsLeft, limit: usage.qrLimit })
      );
      return;
    }

    setImporting(true);
    setProgress(5);

    const tick = window.setInterval(() => {
      setProgress((p) => (p < 85 ? p + 2 : p));
    }, 200);

    try {
      const res = await fetch('/api/qr/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchLabel: batchLabel.trim() || undefined,
          rows,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors?.length) setErrors(data.errors);
        toast.error(data?.error ?? t('bulk.importFailed'));
        return;
      }

      setResult(data);
      setProgress(100);
      toast.success(t('bulk.createdSuccess', { count: data.summary.success }));
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      window.clearInterval(tick);
      setImporting(false);
    }
  };

  const reset = () => {
    setRows([]);
    setErrors([]);
    setFileName(null);
    setResult(null);
    setProgress(0);
    setBatchLabel('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const exportResultCsv = () => {
    if (!result?.created.length) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qrbanner.com';
    const lines = [
      'name,shortCode,category,scanUrl',
      ...result.created.map(
        (qr) =>
          `"${qr.name.replace(/"/g, '""')}",${qr.shortCode},${qr.category},${origin}/s/${qr.shortCode}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrbanner-import-${result.batchId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> {t('bulk.back')}
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold">{t('bulk.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('bulk.subtitle', { max: maxRows })} · {usage.planName}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('bulk.slotsLeft', { remaining: slotsLeft, limit: usage.qrLimit })}
          </p>
        </div>
      </div>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {t('bulk.importComplete')}
            </CardTitle>
            <CardDescription>
              {t('bulk.importSummary', {
                success: result.summary.success,
                total: result.summary.total,
              })}
              {result.batchLabel ? ` · ${t('bulk.batch')}: ${result.batchLabel}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.failed.length > 0 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {t('bulk.rowsFailed', { count: result.failed.length })}
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {result.failed.map((err) => (
                    <li key={`${err.line}-${err.message}`}>
                      {t('bulk.line')} {err.line}: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                  {result.created.map((qr) => (
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

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => router.push('/dashboard')}>{t('bulk.goDashboard')}</Button>
              <Button variant="outline" onClick={exportResultCsv} className="gap-2">
                <Download className="h-4 w-4" /> {t('bulk.exportCsv')}
              </Button>
              <Button variant="outline" onClick={reset}>{t('bulk.importAnother')}</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileSpreadsheet className="h-5 w-5" />
                  {t('bulk.templateTitle')}
                </CardTitle>
                <CardDescription>{t('bulk.templateDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                  {BULK_CSV_TEMPLATE.trim()}
                </div>
                <Button variant="outline" onClick={downloadTemplate} className="gap-2">
                  <Download className="h-4 w-4" /> {t('bulk.downloadTemplate')}
                </Button>
                <p className="text-xs text-muted-foreground">{t('bulk.templateHint')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Upload className="h-5 w-5" />
                  {t('bulk.uploadTitle')}
                </CardTitle>
                <CardDescription>{t('bulk.uploadDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/20 p-6 transition-colors hover:border-primary/50 hover:bg-muted/40"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">{fileName ?? t('bulk.dropHint')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('bulk.csvOnly', { max: maxRows })}
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchLabel">{t('bulk.batchLabel')}</Label>
                  <Input
                    id="batchLabel"
                    placeholder={t('bulk.batchPlaceholder')}
                    value={batchLabel}
                    onChange={(e) => setBatchLabel(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{t('bulk.batchHint')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {errors.length > 0 && (
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                  <AlertCircle className="h-5 w-5" />
                  {t('bulk.validationErrors', { count: errors.length })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {errors.map((err) => (
                    <li key={`${err.line}-${err.message}`} className="text-destructive">
                      {t('bulk.line')} {err.line}: {err.message}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {rows.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {t('bulk.previewTitle', { count: rows.length })}
                  </CardTitle>
                  <CardDescription>{t('bulk.previewDesc')}</CardDescription>
                </div>
                <Button
                  onClick={handleImport}
                  disabled={importing || errors.length > 0 || rows.length > slotsLeft}
                  className="gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t('bulk.creating')}
                    </>
                  ) : (
                    t(rows.length === 1 ? 'bulk.createBtn' : 'bulk.createBtnPlural', {
                      count: rows.length,
                    })
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {importing && <Progress value={progress} className="h-2" />}
                <div className="max-h-96 overflow-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>{t('bulk.name')}</TableHead>
                        <TableHead>{t('bulk.category')}</TableHead>
                        <TableHead>{t('bulk.content')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.line}>
                          <TableCell className="text-muted-foreground">{row.line}</TableCell>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{row.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground">
                            {row.qrData.url ??
                              row.qrData.phone ??
                              row.qrData.ssid ??
                              row.qrData.email ??
                              '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
