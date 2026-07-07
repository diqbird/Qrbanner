'use client';

import { Search, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterOption = { value: string; label: string };

export function AdminDataToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel,
  onRefresh,
  onExport,
  exportLabel,
  refreshLabel,
  extra,
}: {
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  exportLabel?: string;
  refreshLabel?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {onSearchChange ? (
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      ) : null}
      {filterOptions && onFilterChange ? (
        <Select value={filterValue ?? 'all'} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={filterLabel} />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      {extra}
      <div className="flex gap-2 sm:ml-auto">
        {onRefresh ? (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            {refreshLabel}
          </Button>
        ) : null}
        {onExport ? (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {exportLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
