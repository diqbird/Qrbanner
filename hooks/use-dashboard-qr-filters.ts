'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export function useDashboardQrFilters() {
  const searchParams = useSearchParams();

  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [unfiledFilter, setUnfiledFilter] = useState(false);
  const [labelFilter, setLabelFilter] = useState<string | null>(null);
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 450);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchPending = searchQuery.trim() !== debouncedSearch.trim();
  const [favoritesFilter, setFavoritesFilter] = useState(false);
  const [archivedFilter, setArchivedFilter] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [folderFilter, unfiledFilter, labelFilter, batchFilter, debouncedSearch, favoritesFilter, archivedFilter]);

  useEffect(() => {
    const batchFromUrl = searchParams.get('batchId');
    if (batchFromUrl) setBatchFilter(batchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const focusSearch = () => searchInputRef.current?.focus();
    window.addEventListener('dashboard:focus-search', focusSearch);
    return () => window.removeEventListener('dashboard:focus-search', focusSearch);
  }, []);

  const handleSelectFolder = (folderId: string | null, unfiled?: boolean) => {
    setFolderFilter(folderId);
    setUnfiledFilter(Boolean(unfiled));
    setBatchFilter(null);
    setLabelFilter(null);
  };

  const clearFilters = () => {
    setFolderFilter(null);
    setUnfiledFilter(false);
    setLabelFilter(null);
    setBatchFilter(null);
    setSearchQuery('');
    setFavoritesFilter(false);
    setArchivedFilter(false);
  };

  const hasFilters =
    folderFilter ||
    unfiledFilter ||
    labelFilter ||
    batchFilter ||
    debouncedSearch.trim() ||
    favoritesFilter ||
    archivedFilter;

  return {
    folderFilter,
    unfiledFilter,
    labelFilter,
    setLabelFilter,
    batchFilter,
    setBatchFilter,
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    searchInputRef,
    isSearchPending,
    favoritesFilter,
    setFavoritesFilter,
    archivedFilter,
    setArchivedFilter,
    page,
    setPage,
    handleSelectFolder,
    clearFilters,
    hasFilters,
  };
}

export type DashboardQrFiltersState = ReturnType<typeof useDashboardQrFilters>;
